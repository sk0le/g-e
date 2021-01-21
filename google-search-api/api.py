import flask
from flask import request
from main import get_desc

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/api')
def home():
    query = request.args.get('query')
    print(query)
    answers, links, related = get_desc(query)
    response = flask.jsonify({
        "answers": answers, 
        "related": related, 
        "links": links
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


app.run()
