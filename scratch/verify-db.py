import os
from dotenv import load_dotenv
load_dotenv(dotenv_path='../backend/.env')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")
print("Connecting to:", DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

from sqlalchemy import Column, Integer, String, Text, DateTime
Base = declarative_base()

class UserActivity(Base):
    __tablename__ = "user_activities"
    id            = Column(Integer, primary_key=True)
    user_id       = Column(Integer)
    activity_type = Column(String(100))
    details       = Column(Text)
    timestamp     = Column(DateTime)

activities = db.query(UserActivity).order_by(UserActivity.id.desc()).all()
print(f"\nFound {len(activities)} activities in database:")
for act in activities:
    # safe print for Windows console
    safe_details = act.details.replace('₹', 'Rs. ') if act.details else ''
    print(f"[{act.timestamp}] ID: {act.id} | User: {act.user_id} | Type: {act.activity_type} | Details: {safe_details}")

db.close()
