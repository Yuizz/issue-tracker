FROM python:3.8

ENV PYTHONUNBUFFERED=1

RUN mkdir /issuetracker
WORKDIR /issuetracker

COPY requirements.txt /issuetracker/

RUN pip install -r requirements.txt

COPY . /issuetracker/

