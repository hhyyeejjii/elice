from flask import Blueprint, json, render_template, redirect, jsonify, request, session, g
from dbconnect import db
from models import User
from flask_bcrypt import Bcrypt

library = Blueprint('library',__name__)
bcrypt = Bcrypt()