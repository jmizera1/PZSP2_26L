from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from . import models, schemas
from .db import SessionLocal, engine
from .security import get_password_hash, verify_password, create_access_token

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


class LoginRequest(BaseModel):
    email: str
    password: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "API running"}


@app.post("/login")
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email).first()

    if not user or not verify_password(creds.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.user_id})

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_data = user.dict()

    hashed_password = get_password_hash(user_data["password"])

    user_data["password"] = hashed_password

    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/experiments", response_model=schemas.Experiment)
def create_experiment(exp: schemas.ExperimentCreate, db: Session = Depends(get_db)):
    db_exp = models.Experiment(**exp.dict())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp


@app.post("/results", response_model=schemas.Result)
def create_result(result: schemas.ResultCreate, db: Session = Depends(get_db)):
    db_result = models.Result(
        experiment_experiment_id=result.experiment_id,
        number_of_agents=result.number_of_agents,
        platform_name=result.platform_name,
        workload=result.workload,
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result


@app.get("/results")
def get_all_results(db: Session = Depends(get_db)):
    return db.query(models.Result).all()


@app.get("/experiments")
def get_experiments(db: Session = Depends(get_db)):
    return db.query(models.Experiment).all()


@app.get("/experiments/{experiment_id}")
def get_experiment(experiment_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Experiment)
        .filter(models.Experiment.experiment_id == experiment_id)
        .first()
    )


@app.get("/experiments/{experiment_id}/results")
def get_results(experiment_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Result)
        .filter(models.Result.experiment_experiment_id == experiment_id)
        .all()
    )


@app.get("/experiments/{experiment_id}/metrics")
def get_experiment_metrics(experiment_id: int, db: Session = Depends(get_db)):
    """Return all experiment_metrics for a given experiment, joined with metric info."""
    results = (
        db.query(models.Result)
        .filter(models.Result.experiment_experiment_id == experiment_id)
        .all()
    )
    result_ids = [r.result_id for r in results]
    if not result_ids:
        return []
    rows = (
        db.query(models.ExperimentMetric, models.Metric)
        .join(
            models.Metric,
            models.ExperimentMetric.metric_metric_id == models.Metric.metric_id,
        )
        .filter(models.ExperimentMetric.result_result_id.in_(result_ids))
        .all()
    )
    return [
        {
            "experiment_metric_id": em.experiment_metric_id,
            "value": em.value,
            "result_result_id": em.result_result_id,
            "metric_name": m.name,
            "metric_unit": m.unit,
        }
        for em, m in rows
    ]


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/experiments/full")
def create_full_experiment(
    data: schemas.FullExperimentCreate, db: Session = Depends(get_db)
):
    exp = models.Experiment(
        name=data.name,
        description=data.description,
        user_id=data.user_id,
        user_id1=data.user_id,
    )
    db.add(exp)
    db.flush()

    res = models.Result(
        experiment_experiment_id=exp.experiment_id,
        number_of_containers=data.number_of_containers,
        platform_name=data.platform_name,
        workload=data.workload,
        number_of_agents=data.number_of_agents,
        number_of_repetitions=data.number_of_repetitions,
        message_size=data.message_size,
        group_size=data.group_size,
        ram=data.ram,
        vcpu=data.vcpu,
    )
    db.add(res)
    db.flush()

    def get_or_create_metric(name: str, unit_name: str):
        unit = db.query(models.Unit).filter(models.Unit.unit == unit_name).first()
        if not unit:
            unit = models.Unit(unit=unit_name)
            db.add(unit)
            db.flush()

        metric = db.query(models.Metric).filter(models.Metric.name == name).first()
        if not metric:
            metric = models.Metric(
                name=name,
                unit=unit_name,
                unit_unit_id=unit.unit_id,
            )
            db.add(metric)
            db.flush()
        return metric

    m_throughput = get_or_create_metric("Throughput", "msg/s")
    m_latency = get_or_create_metric("Latency", "ms")
    m_cpu = get_or_create_metric("CPU Usage", "%")

    em1 = models.ExperimentMetric(
        value=data.throughput,
        id1=1,
        metric_metric_id=m_throughput.metric_id,
        result_result_id=res.result_id,
    )
    em2 = models.ExperimentMetric(
        value=data.latency,
        id1=2,
        metric_metric_id=m_latency.metric_id,
        result_result_id=res.result_id,
    )
    em3 = models.ExperimentMetric(
        value=data.cpu_usage,
        id1=3,
        metric_metric_id=m_cpu.metric_id,
        result_result_id=res.result_id,
    )
    db.add_all([em1, em2, em3])
    db.commit()

    return {"status": "success", "experiment_id": exp.experiment_id}
