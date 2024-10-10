from flask import Flask, render_template, request, jsonify
import random
import os
import json

app = Flask(__name__)

def get_computer_choice():
    choices = ['r', 'p', 's']
    return random.choice(choices)

def convert_to_word(letter):
    if letter == 'r':
        return "Rock"
    elif letter == 'p':
        return "Paper"
    elif letter == 's':
        return "Scissors"

def determine_winner(user_choice, computer_choice):
    if user_choice == computer_choice:
        return "draw"
    elif (user_choice == 'r' and computer_choice == 's') or \
         (user_choice == 'p' and computer_choice == 'r') or \
         (user_choice == 's' and computer_choice == 'p'):
        return "win"
    else:
        return "loss"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play_game():
    user_choice = request.json.get('userChoice')
    computer_choice = get_computer_choice()
    result = determine_winner(user_choice, computer_choice)
    
    return jsonify({
        'userChoice': convert_to_word(user_choice),
        'computerChoice': convert_to_word(computer_choice),
        'result': result
    })

@app.route('/api/questions')
def get_questions():
    # Path to the JSON file
    json_file_path = os.path.join(app.static_folder, 'data', 'quizQuestions.json')
    
    # Read the JSON file
    with open(json_file_path, 'r') as file:
        questions = json.load(file)

    return jsonify(questions)

if __name__ == "__main__":
    app.run(debug=True)
