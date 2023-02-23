const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 8081;

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host : 'localhost',
        user : 'root',
        password: 'root',
        port: 3306,
        connectionLimit:5
});

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition :{
        info:{
            title: 'AkshithaRaoChitneni',
            version: '1.0.0',
            description: 'ITIS 6177'
        },
        host: '137.184.102.214:3000',
        basePath: '/',
    },
    apis: ['./server1.js'],
}

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @swagger
 * /agents:
 *     get:
 *       description: Return all agents
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: Object food containing array of food object with prices
*/
app.get('/agents',(req,resp) =>{
    pool.query('SELECT * from sample.agents')
        .then(res => {
                resp.statusCode = 200;
                resp.setHeader('Content-Type','Application/json');
                resp.send(res);
                })
        .catch(err =>{ 
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
    // res.json(agents);
});


/**
 * @swagger
 * /agents:
 *  put:
 *    description: Updates agents
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPut"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPut"
 *    responses: 
 *      200:
 *       description: A successfull response
 * definitions:
 *   agentPut:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A486
 *       agentName:
 *         type: string
 *         example: prachi
 *       workingArea: 
 *         type: string
 *         example: hyderabad
 *       commission:
 *         type: number
 *         example: 5
 *       phoneNo:
 *         type: string
 *         example: 9912345621
 *       country:
 *         type: string
 *         example: India
*/
app.put('/agents', (req,resp) =>{
    pool.query(`update sample.agents set agent_name = '${req['body'].agentName}',  working_area = '${req['body'].workingArea}', commission  = '${req['body'].commission}', phone_no = '${req['body'].phoneNo}', country = '${req['body'].country}' where agent_code = '${req['body'].agentCode}'`).then(res => {
                console.log(res.affectedRows);
                if(res.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send("The agent is not located in the table - Operation  unsuccessful");
                }
              })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});



/**
 * @swagger
 * /agents:
 *  post:
 *    description: Updates agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPost"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPost"
 *    responses:
 *      200:
 *       description: A successfull response
 * definitions:
 *   agentPost:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A009
 *       agentName:
 *         type: string
 *         example: prachi
 *       workingArea:
 *         type: string
 *         example: nagpur
 *       commission:
 *         type: number
 *         example: 10
 *       phoneNo:
 *         type: string
 *         example: 8901231242
 *       country:
 *         type: string
 *         example: India
*/
app.post('/agents',(req,resp) =>{
    pool.query(`insert into sample.agents values ('${req['body'].agentCode}', '${req['body'].agentName}', '${req['body'].workingArea}', '${req['body'].commission}', '${req['body'].phone_no}', '${req['body'].country}')`).then(res => {
               console.log(res);
                 if(res.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('No rows added -Operation unsuccessful');
                }
               })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  delete:
 *    description: Removes product
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: name
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentDel"
 *    responses: 
 *      200:
 *       description: A successfull responseii
 * definitions:
 *   agentDel:
 *     type: object
 *     required:
 *     - agentCode
 *     properties:
 *       agentCode:
 *         type: string
 *         example: 'A146'
*/
app.delete('/agents',(req,resp) =>{
    pool.query(`delete from sample.agents where agent_Code =  ('${req['body'].agentCode}')`).then(res => {
               console.log(res);
                 if(res.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('No rows delete - operation unsuccessful');
                }
               })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  patch:
 *    description: updates or inserts agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPatch"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPatch"
 *    responses:
 *      200:
 *       description: A successfull response
 * definitions:
 *   agentPatch:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A300
 *       agentName:
 *         type: string
 *         example: prachi
 *       workingArea:
 *         type: string
 *         example: nagpur
 *       commission:
 *         type: number
 *         example: 5
 *       phoneNo:
 *         type: string
 *         example: 52345621
 *       country:
 *         type: string
 *         example: India
*/
app.patch('/agents',(req,resp) =>{
    pool.query(`update sample.agents set agent_name = '${req['body'].agentName}',  working_area = '${req['body'].workingArea}', commission  = '${req['body'].commission}', phone_no = '${req['body'].phoneNo}', country = '${req['body'].country}' where agent_code = '${req['body'].agentCode}'`).then(res => {
                console.log(res.affectedRows);
                if(res.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                    pool.query(`insert into sample.agents values('${req['body'].agentCode}', '${req['body'].agentName}', '${req['body'].workingArea}', '${req['body'].commission}', '${req['body'].phoneNo}', '${req['body'].country}')`).then(res1 => {
                        if(res1.affectedRows > 0)
                        {
                            resp.statusCode = 200;                 
                            resp.setHeader('Content-Type','Application/json');
                            resp.send(res1);
                        }
                        else{
                            resp.statusCode = 201;
                            resp.setHeader('Content-Type','text/plain');
                            resp.send("The agent is not located in the table - Operation  unsuccessful");
                        }
                    })
                    .catch(err =>{
                        resp.statusCode = 404;
                        console.error('Error exccuting query', err.stack);
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('Error executing query' + err.stack);
                    });
                }
              })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});


app.listen(port, ()=>{
    console.log(`API server at ${port}`);
});
