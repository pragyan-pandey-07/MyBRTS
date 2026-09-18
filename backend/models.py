from sqlalchemy import Column, Integer, String, Time
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class BusSchedule(Base):
    __tablename__ = 'bus_schedules'

    id = Column(Integer, primary_key=True, index=True)
    route_number = Column(String, index=True)
    departure_time = Column(Time)
    arrival_time = Column(Time)
    origin = Column(String)
    destination = Column(String)
