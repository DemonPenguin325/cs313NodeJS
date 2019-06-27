CREATE TABLE person(
    person_id   SERIAL PRIMARY KEY,
    first_name  VARCHAR(30),
    last_name   VARCHAR(30),
    dob         DATE
);

CREATE TABLE person_person(
    person_person_id    SERIAL PRIMARY KEY,
    parent_id           INT REFERENCES person(person_id),
    child_id            INT REFERENCES person(person_id)
);

INSERT INTO person (first_name, last_name, dob) VALUES ('john', 'doe', to_date('20170103', 'YYYYMMDD'));
INSERT INTO person (first_name, last_name, dob) VALUES ('john', 'jacob_jingleheimer_schmit', to_date('18920103', 'YYYYMMDD'));

INSERT INTO person_person (parent_id, child_id) VALUES (2, 1);