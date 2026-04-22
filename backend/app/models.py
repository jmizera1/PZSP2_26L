from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
from .db import Base


class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(4000))
    surname = Column(String(4000))
    email = Column(String(4000))


class Experiment(Base):
    __tablename__ = "experiment"

    experiment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(4000))
    creation_date = Column(String, default=str(date.today()))
    description = Column(String)
    user_id = Column(Integer, ForeignKey("user.user_id"))

    results = relationship("Result", back_populates="experiment")


class Result(Base):
    __tablename__ = "result"

    result_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    experiment_experiment_id = Column(Integer, ForeignKey("experiment.experiment_id"))

    number_of_agents = Column(Integer)
    platform_name = Column(String(4000))
    workload = Column(String(4000))

    experiment = relationship("Experiment", back_populates="results")


class Metric(Base):
    __tablename__ = "metric"

    metric_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(4000))
    unit = Column(String(4000))


class ExperimentMetric(Base):
    __tablename__ = "experiment_metric"

    experiment_metric_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    value = Column(Float)

    metric_metric_id = Column(Integer, ForeignKey("metric.metric_id"))
    result_result_id = Column(Integer, ForeignKey("result.result_id"))