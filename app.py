from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "secret123"

# Temporarty storage for song suggestions
suggestions = []

# Owners picked song gets stored
next_song = None


@app.route("/", methods=["GET", "POST"])
def home():
    global next_song

    if request.method == "POST":
        song = request.form["song"]
        artist = request.form["artist"]
        youtube = request.form["youtube"]

        suggestions.append({
            "id": len(suggestions),
            "song": song,
            "artist": artist,
            "youtube": youtube
        })

        flash("Request sent!")
        return redirect(url_for("home"))

    return render_template(
        "index.html",
        suggestions=suggestions,
        next_song=next_song
    )


@app.route("/owner")
def owner():
    return render_template(
        "owner.html",
        suggestions=suggestions,
        next_song=next_song
    )


@app.route("/choose/<int:song_id>", methods=["POST"])
def choose_song(song_id):
    global next_song

    for song in suggestions:
        if song["id"] == song_id:
            next_song = song
            break

    return redirect(url_for("owner"))


if __name__ == "__main__":
    app.run(debug=True)