-- Circles persistence for Albion Faeries
CREATE TABLE IF NOT EXISTS circles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL REFERENCES circles(id),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL REFERENCES circles(id),
  title TEXT NOT NULL,
  owner TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

INSERT OR IGNORE INTO circles (id, name, sort_order) VALUES
  ('comms', 'Communications', 1),
  ('events', 'Gatherings & Events', 2),
  ('finance', 'Finance', 3);

INSERT OR IGNORE INTO notes (id, circle_id, body) VALUES
  ('n1', 'comms', 'Seed note: bring hosting recommendation to Finance at next Comms.'),
  ('n2', 'events', 'Seed note: Lughnasadh helpers list opens with the call.');

INSERT OR IGNORE INTO actions (id, circle_id, title, owner, status) VALUES
  ('a1', 'comms', 'Confirm two DNS administrators', 'Comms', 'open'),
  ('a2', 'finance', 'Explore gathering insurance options', 'Finance', 'open');
