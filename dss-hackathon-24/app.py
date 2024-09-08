from flask import Flask, jsonify, request, render_template
import pandas as pd
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from flask_cors import CORS, cross_origin
import re


app = Flask(__name__)
# Allow CORS for all domains (useful during development)
CORS(app)

# load files===========================================================================================================
# trending_products = pd.read_csv("models/trending_products.csv")
# train_data = pd.read_csv("models/clean_data.csv")

# database configuration---------------------------------------
# app.secret_key = "alskdjfwoeieiurlskdjfslkdjf"
# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:@localhost/ecom"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

# Connect to MongoDB running on localhost at port 27017 (default port)
client = MongoClient('mongodb://localhost:27017/')
# Select a database (it will create a new one if it doesn't exist)
db = client['dss']

# Select a collection (like a table in relational databases)
collection = db['collections']
user_collection = db['users']

train_data = pd.read_csv("dss-hackathon-24/udemy.csv")
user_data = pd.read_csv("dss-hackathon-24/data.csv")




# Recommendations functions============================================================================================
# Function to truncate product name
def truncate(text, length):
    if len(text) > length:
        return text[:length] + "..."
    else:
        return text


def content_based_recommendations(item_name, top_n=10):
    
    # Create a TF-IDF vectorizer for item descriptions
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')

    # Apply TF-IDF vectorization to item descriptions
    tfidf_matrix_content = tfidf_vectorizer.fit_transform(user_data['tags'])

    # Calculate cosine similarity between items based on descriptions
    cosine_similarities_content = cosine_similarity(tfidf_matrix_content, tfidf_matrix_content)

    # Find the index of the item
    item_index = user_data[user_data['title'] == item_name].index[0]

    # Get the cosine similarity scores for the item
    similar_items = list(enumerate(cosine_similarities_content[item_index]))

    # Sort similar items by similarity score in descending order
    similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)

    # Get the top N most similar items (excluding the item itself)
    top_similar_items = similar_items[1:top_n+1]

    # Get the indices of the top similar items
    recommended_item_indices = [x[0] for x in top_similar_items]

    # Get the details of the top similar items
    recommended_items_details = train_data.iloc[recommended_item_indices][['title', 'rating', 'num_reviews',]]

    return recommended_items_details

def collaborative_filtering_recommendations(target_user_id, title):
    user_item_matrix = user_data.pivot_table(index='userId', columns='id', values='feedback_ratings', aggfunc='mean').fillna(0).astype(int)
    user_similarity = cosine_similarity(user_item_matrix)
    target_user_index = user_item_matrix.index.get_loc(target_user_id)
    user_similarities = user_similarity[target_user_index]
    similar_user_indices = user_similarities.argsort()[::-1][1:]
    reccomend_items = []

    for user_index in similar_user_indices:
        rated_by_similar_user = user_item_matrix.iloc[user_index]
        not_rated_by_target_user = (rated_by_similar_user == 0) & (user_item_matrix.iloc[target_user_index] == 0)
        reccomend_items.extend(user_item_matrix.columns[not_rated_by_target_user][:10])

    recommended_items_details = user_data[user_data['id'].isin(reccomend_items)][['title', 'rating', 'num_reviews']]
    return recommended_items_details
# routes===============================================================================

@app.route('/recommend', methods=['GET'])
def hybrid_recommendations():
    # Fetch query parameters using request.args
    top_n  = int(request.args.get('count', 10))    # Get 'count' from query params
    item_name = request.args.get('title')  # Get 'title' from query params

    # Assuming target_user_id is hardcoded for now
    target_user_id = 1

    content_based_rec = content_based_recommendations(item_name)
    collaborative_rec = collaborative_filtering_recommendations(target_user_id, item_name)
    # Calculate the number of samples needed from each DataFrame
    total_samples = min(len(content_based_rec), len(collaborative_rec))  # or define a specific total number
    content_samples = int(total_samples * 0.7)
    collaborative_samples = int(total_samples * 0.3)

    # Sample from each DataFrame
    content_based_sample = content_based_rec.sample(content_samples, random_state=42)
    collaborative_sample = collaborative_rec.sample(collaborative_samples, random_state=42)

    # Concatenate the samples
    hybrid_rec = pd.concat([content_based_sample, collaborative_sample]).drop_duplicates().reset_index(drop=True)

    # If needed, shuffle the combined DataFrame to mix the content
    hybrid_rec = hybrid_rec.sample(frac=1, random_state=42).reset_index(drop=True).to_dict(orient='records')
    print("Data ",type(hybrid_rec))
    for i in hybrid_rec:
        print(i)

    return jsonify(hybrid_rec), 201
# routes===============================================================================


CORS(app, resources={r"/signup": {"origins": "http://localhost:5173"}})
@app.route("/signup", methods=['POST',])
def signup():
    if request.is_json:
        data = request.get_json()
        
        # Extract the required fields
        topic = data.get('topic')
        level = data.get('level')
        learning_preference = data.get('learning_preference')
        learning_goal = data.get('learning_goal')


        # Create a new user document
        new_user = {
            'userId': "12",
            'title': topic,
            'level_of_difficulty': level,
            'learning_style': learning_preference,
            'learning_goals': learning_goal,
        }

        try:
            # Insert the document into the collection
            result = user_collection.insert_one(new_user)

            # Return the inserted document ID
            return jsonify({"message": "User created", "user_id": str(12)}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Request must be JSON"}), 400
    
    
@app.route('/courses', methods=['GET'])
def search_users():
    # Find the user by userId
    user = user_collection.find_one({"userId": "12"})

    if user:
        # Access the 'topic' field
        topic = user.get('title', 'No topic field found')
        # Find users matching the title in the tags
        users = collection.find({
        'title': {
                '$regex': topic,
            }}).limit(20)
        # Convert the MongoDB cursor to a list of dictionaries
        users_list = list(users)
        
        # Sort users based on rating
        sorted_users = sorted(users_list, key=lambda x: x.get('rating', 0), reverse=True)

        result = []
        for i in sorted_users:
            # Initialize an empty dictionary
            user_data = {}

            # Prompt the user for input and add it to the dictionary
            
            user_data['title'] = str(i.get('title'))
            user_data['rating'] = str(i.get('rating'))
            user_data['num_reviews'] = str(i.get('num_reviews'))
            result.append(user_data)

        # print(result)

        return jsonify(result)
    else:
        return "User Does not exist"
            


@app.route('/add_activity', methods=['POST'])
def add_activity():
    # Get JSON data from request
    data = request.json
    
    # Check if the required fields are in the request
    required_fields = [
        'userId', 'id', 'previous_test_scores', 'learning_style', 
        'learning_goals', 'course_duration', 'engagement_time_spent',
        'module_objectives', 'assessment_scores', 'feedback_comments', 
        'feedback_ratings', 'level_of_difficulty'
    ]
    
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    # Define the MongoDB collection
    collection = db['activity']
    
    # Query for matching userId and id
    query = {
        'userId': {'$in': data['userId']},
        'id': {'$in': data['id']}
    }
    
    # Data to update or insert
    update_data = {
        '$set': {
            'previous_test_scores': data['previous_test_scores'],
            'learning_style': data['learning_style'],
            'learning_goals': data['learning_goals'],
            'course_duration': data['course_duration'],
            'engagement_time_spent': data['engagement_time_spent'],
            'module_objectives': data['module_objectives'],
            'assessment_scores': data['assessment_scores'],
            'feedback_comments': data['feedback_comments'],
            'feedback_ratings': data['feedback_ratings'],
            'level_of_difficulty': data['level_of_difficulty']
        }
    }
    
    # Update or insert the data
    result = collection.update_one(query, update_data, upsert=True)
    
    if result.matched_count > 0:
        message = 'Data updated successfully'
    else:
        message = 'Data inserted successfully'
    
    return jsonify({'message': message})



if __name__=='__main__':
    app.run(debug=True)