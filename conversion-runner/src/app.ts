import express from "express";
import bodyParser from "body-parser";
import { exec } from "child_process";

const app = express();
app.use(bodyParser.json());

app.get("/run-conversion", (req, res) => {

    console.log("Start processing request at: " + new Date().toLocaleString());
    exec('box task run taskFile=D:\\devfolder\\code\\lcb_websites\\CFTasks\\src\\redesign\\ConversionTask target=run :env=local :webroot=D:\\devfolder\\code\\lcb_websites', (error, stdout, stderr) => {
        if (error) {
            console.error("_error: ", error);
            res.status(500);
            res.json({
                message: error
            });
            return;
        }

        if (stderr) {
            console.error("_stderr: ", stderr);
            res.status(500);
            res.json({
                message: stderr
            });
            return;
        }

        console.log("_stdout: ", stdout);
        res.status(200);
        res.json({
            message: stdout
        });

    });
})

app.get("/find-candidates", (req, res) => {
    console.log("Start processing GET /find-candidates request at: " + new Date().toLocaleString());
    exec('box task run taskFile=D:\\devfolder\\code\\lcb_websites\\CFTasks\\src\\redesign\\HeadingCandidateTask', (error, stdout, stderr) => {
        if (error) {
            console.error("_error: ", error);
            res.status(500);
            res.json({
                message: error
            });
            return;
        }

        if (stderr) {
            console.error("_stderr: ", stderr);
            res.status(500);
            res.json({
                message: stderr
            });
            return;
        }

        console.log("_stdout: ", stdout);
        res.status(200);
        res.json({
            message: stdout
        });

    });
})

app.listen(4300, () => {
    console.log("Server started at http://localhost:4300");
})