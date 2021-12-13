import { Card } from "@mui/material";
import axios from "axios";
import { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import List from "@material-ui/core/List";
import configs from "../config";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listFilms: [],
      currentDir: [],
      contents: [],
    };
  }

  componentDidMount() {
    axios
      .get("?directory=films")
      .then((res) => {
        this.setState({ listFilms: res.data });
        this.setState({ currentDir: ["films"] });
        this.getLocalLastDirectoryContent();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getLocalLastDirectoryContent() {
    const path = this.state.currentDir.join("\\");
    console.log("path:", path);
    let result = this.state.listFilms
      .filter((item) => {
        return String(item).startsWith(path);
      })
      .map((item) => {
        let sub = item.replace(path, "").split("\\");
        return sub[1];
      })
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    console.log("result:", result);
    this.setState({ contents: result });
  }

  handleBack = (e) => {
    e.preventDefault();
    let current = this.state.currentDir;
    if (current.length > 1) current.pop();
    console.log("curr:", current);
    this.setState({ currentDir: current });
    this.getLocalLastDirectoryContent();
  };

  clickItem = (e, data) => {
    e.preventDefault();
    if (data.indexOf(".jpg") !== -1) {
      //image
      return;
    }

    let current = this.state.currentDir;
    current.push(data);
    this.setState({ currentDir: current });
    this.getLocalLastDirectoryContent();
  };

  render() {
    return (
      <>
        <AppBar>
          <Toolbar>
            {this.state.currentDir.length > 1 ? (
              <IconButton
                edge="start"
                color="inherit"
                onClick={(e) => {
                  this.handleBack(e);
                }}
                aria-label="close"
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              ""
            )}
            <div className="right-title">
            <h6
              style={{ color: "#ffffff", marginTop: "5px" }}
            >
              {this.state.currentDir[this.state.currentDir.length-1]}
            </h6>
          </div>
          </Toolbar>
        </AppBar>
        <List className="d-flex flex-column mt-5">
          {this.state.contents.length !== 0
            ? this.state.contents.map((item, key) => {
                return (
                  <a
                    href={
                      configs.API_URL +
                      this.state.currentDir.join("\\") +
                      "\\" +
                      item
                    }
                    onClick={(e) => {
                      this.clickItem(e, item);
                    }}
                  >
                    <Card
                      style={{ direction: "rtl" }}
                      key={key}
                      className={"d-flex flex-row m-2 p-3"}
                    >
                      {item.indexOf(".jpg") !== -1 ? (
                        <div style={{textAlign:'center',width:'100%'}}>
                            <img
                          style={{width:'100%'}}
                          alt={item}
                          src={
                            configs.API_URL +
                            this.state.currentDir.join("\\") +
                            "\\" +
                            item
                          }
                        />
                        <h3>{item.replace('.jpg','')}</h3>
                        </div>
                      ) : (
                        <label style={{ direction: "rtl" }}>{item}</label>
                      )}
                    </Card>
                  </a>
                );
              })
            : ""}
        </List>
      </>
    );
  }
}

export default Home;
