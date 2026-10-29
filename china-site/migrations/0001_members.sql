CREATE TABLE member_counter (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  value INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE member_requests (
  request_key TEXT PRIMARY KEY NOT NULL,
  member_number INTEGER UNIQUE,
  nickname TEXT NOT NULL,
  title TEXT NOT NULL,
  joined TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rate_limits (
  fingerprint TEXT PRIMARY KEY NOT NULL,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);

INSERT INTO member_counter (id, value) VALUES (1, 0);

CREATE TRIGGER allocate_member_number
AFTER INSERT ON member_requests
FOR EACH ROW WHEN NEW.member_number IS NULL
BEGIN
  UPDATE member_counter SET value = value + 1 WHERE id = 1;
  UPDATE member_requests
  SET member_number = (SELECT value FROM member_counter WHERE id = 1)
  WHERE request_key = NEW.request_key;
END;
