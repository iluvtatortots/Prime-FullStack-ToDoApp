CREATE TABLE todolist (
	id SERIAL PRIMARY KEY NOT NULL,
	task TEXT,
	created TIMESTAMP DEFAULT current_timestamp,
	status BOOLEAN
);
