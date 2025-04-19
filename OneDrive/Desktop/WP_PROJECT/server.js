require('dotenv').config();

const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');

const cors = require('cors'); 
app.use(cors({
  origin: '*' 
}));

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); 
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
  
(async () => {
    try {
        const connection = await oracledb.getConnection({
            user: "system",
            password: "vishakha",
            connectString: "localhost:1521/XE"
        });
        console.log("Connected to Oracle DB");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
})();

app.post('/student-signup', async (req, res) => {
    const { id, username, email, branch, course, year, contact, password } = req.body;
    
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        
        await connection.execute(
            `INSERT INTO students 
             (id, username, email, branch, course, year, contact, password) 
             VALUES (:id, :username, :email, :branch, :course, :year, :contact, :password)`,
            [id, username, email, branch, course, year, contact, password],
            { autoCommit: true }
        );
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        
        if (err.errorNum === 1) { 
             res.status(400).json({ success: false, message: "Student ID already exists" });
        } else {
            res.status(500).json({ success: false, message: "Database error" });
        }
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Error closing connection:", e);
            }
        }
    }
});
app.listen(5500, () => {
    console.log("Server running at http://localhost:5500");
});

app.post("/student-login", async (req, res) => {
    const { id, password } = req.body;
    
    try {
        const user = await authenticateUser(id, password); 
      
        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
  
function authenticateUser(id, password) {
}
  
app.listen(5500, () => console.log("Server running on port 5500"));

const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

oracledb.initOracleClient(); // optional depending on your setup

const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  connectString: 'localhost/orcl'  // update with your DB
};

// Route to get all events
app.get('/events', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM events ORDER BY date`);
    res.json(result.rows.map(row => ({
      id: row[0],
      title: row[1],
      date: row[2],
      time: row[3],
      venue: row[4],
      description: row[5]
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching events');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
