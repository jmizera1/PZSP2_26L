from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .db import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
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
    return db.query(models.Experiment).filter(
        models.Experiment.experiment_id == experiment_id
    ).first()


@app.get("/experiments/{experiment_id}/results")
def get_results(experiment_id: int, db: Session = Depends(get_db)):
    return db.query(models.Result).filter(
        models.Result.experiment_experiment_id == experiment_id
    ).all()