from datetime import date

from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .db import Base


class UserType(Base):
    __tablename__ = "user_type"

    user_type_id = Column(Integer, primary_key=True)
    type = Column(String(255), nullable=False)


class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    surname = Column(String(255), nullable=False)
    org = Column(String(255), nullable=False)
    user_type_user_type_id = Column(
        Integer, ForeignKey("user_type.user_type_id"), nullable=False
    )
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)


class Experiment(Base):
    __tablename__ = "experiment"

    experiment_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    creation_date = Column(Date, nullable=False, default=date.today)
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    user_id1 = Column(Integer, nullable=False)

    results = relationship("Result", back_populates="experiment")


class Unit(Base):
    __tablename__ = "unit"

    unit_id = Column(Integer, primary_key=True)
    unit = Column(String(255), nullable=False)


class Result(Base):
    __tablename__ = "result"

    result_id = Column(Integer, primary_key=True)
    experiment_experiment_id = Column(
        Integer, ForeignKey("experiment.experiment_id"), nullable=False
    )
    number_of_containers = Column(Integer)
    platform_name = Column(String(255))
    workload = Column(String(255))
    number_of_agents = Column(Integer)
    number_of_repetitions = Column(Integer)
    message_size = Column(Integer)
    group_size = Column(Integer)
    ram = Column(Float)
    vcpu = Column(String(255))

    experiment = relationship("Experiment", back_populates="results")


class Metric(Base):
    __tablename__ = "metric"

    metric_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    unit = Column(String(255), nullable=False)
    unit_unit_id = Column(Integer, ForeignKey("unit.unit_id"), nullable=False)


class ExperimentMetric(Base):
    __tablename__ = "experiment_metric"

    experiment_metric_id = Column(Integer, primary_key=True)
    value = Column(Float, nullable=False)
    id1 = Column(Integer, nullable=False)
    metric_metric_id = Column(Integer, ForeignKey("metric.metric_id"), nullable=False)
    result_result_id = Column(Integer, ForeignKey("result.result_id"), nullable=False)