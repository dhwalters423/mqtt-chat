# mqtt-chat
A basic mqtt chat client with websockets

# The Purpose
The purpose of mqtt-chat is to make a purely browser-based chat client using MQTT Websockets (the Paho client) with no additional services running anywhere on a server. Just hook into an existing public MQTT broker with Websockets enabled, and chat away.

# The Goal
The goal of mqtt-chat is to see how far a pure, MQTT-based chat client can go. Many challenges exist with this architecture that can be solved with server-side FTP storage, server-side logging and chat bots, but we don't want to use any of that. Any public MQTT broker should be sufficient to run mqtt-chat immediately.

# The Road Map
- Support for secure private messaging
- Support for multiple chat channels and managing presence in each
- Ability to send images and other non-UTF8 data.
- Additional themes, because white hurts my eyes.
- Additional syntax highlighting and user interaction
- Idea for a new feature? Just make an Issue request, or better yet- submit a pull request!

# Can I use mqtt-chat in my project?
Of course! Just clone the project into your public facing server, hook in a .

# How do I set up an MQTT broker?
I recommend using Mosquitto, it's open source and easy to set up. Follow the official Mosquitto documentation here: http://www.eclipse.org/mosquitto/download/

If you're using Debian Wheezy, fair warning- Websockets are not enabled when installing mosquitto using the apt package manager. For more information, here is a great blog post on how to manually install Mosquitto: http://www.xappsoftware.com/wordpress/2015/05/18/six-steps-to-install-mosquitto-1-4-2-with-websockets-on-debian-wheezy/comment-page-1/

# Is there a live demo?
Check out a live demo here: http://vps317831.ovh.net/mqtt-chat/index.html?broker=vps317831.ovh.net&port=9001
