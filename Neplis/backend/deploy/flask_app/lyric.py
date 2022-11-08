from flask import Flask, make_response, jsonify, request, redirect

import lyricsgenius
genius = lyricsgenius.Genius('kyRAMuvMjj_YFz4u_XFhy8SIQEJ9IYUm0anFfZNFRMKi6XE3C-i-pyM7vBKdml4y')

app = Flask(__name__)

# title = request.values['title']
# musician = request.values['musician']
# song = genius.search_song(title, musician)
# tmp = song.lyrics
# print(tmp)

@app.route('/api/lyric', methods=['POST'])
def lyric():
    title = request.values['title']
    musician = request.values['musician']
    song = genius.search_song(title, musician)
    tmp = song.lyrics
    return tmp

@app.route('/api/hi', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        return 'The model is up and running. Send a POST request'

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")