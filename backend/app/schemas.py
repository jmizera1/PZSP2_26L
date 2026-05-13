from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    surname: str
    org: str
    email: str
    password: str
    user_type_user_type_id: int


class UserCreate(UserBase):
    pass


class User(UserBase):
    user_id: int

    class Config:
        from_attributes = True


class ExperimentCreate(BaseModel):
    name: str
    description: str
    user_id: int
    user_id1: int


class Experiment(BaseModel):
    experiment_id: int
    name: str

    class Config:
        from_attributes = True


class ResultCreate(BaseModel):
    experiment_id: int
    number_of_agents: int
    platform_name: str
    workload: str


class Result(BaseModel):
    result_id: int
    experiment_experiment_id: int
    number_of_agents: int
    platform_name: str
    workload: str

    class Config:
        from_attributes = True


class MetricBase(BaseModel):
    name: str
    unit: str


class Metric(MetricBase):
    metric_id: int

    class Config:
        from_attributes = True


class ExperimentMetricBase(BaseModel):
    value: float
    metric_metric_id: int
    result_result_id: int


class ExperimentMetric(ExperimentMetricBase):
    experiment_metric_id: int

    class Config:
        from_attributes = True


class FullExperimentCreate(BaseModel):
    name: str
    description: str
    platform_name: str
    workload: str
    number_of_agents: int
    number_of_repetitions: int
    number_of_containers: int
    message_size: int
    group_size: int
    ram: float
    vcpu: str
    throughput: float
    latency: float
    cpu_usage: float
    user_id: int