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
    if(current.length>1)
        current.pop();
    console.log("curr:", current);
    this.setState({ currentDir: current });
    this.getLocalLastDirectoryContent();
  };

  clickItem = (e, data) => {
    e.preventDefault();
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
          </Toolbar>
        </AppBar>
        <List style={{ marginTop: "10%" }}>
          {this.state.contents.length !== 0
            ? this.state.contents.map((item, key) => {
                return (
                  <Card key={key} className={"mt-2"}>
                    <a
                      href={configs.API_URL+this.state.currentDir.join('\\')+'\\'+item}
                      onClick={(e) => {
                        this.clickItem(e, item);
                      }}
                    >
                      {
                          item.indexOf('.jpg')!==-1?
                          <img height={150} alt={item} src={configs.API_URL+this.state.currentDir.join('\\')+'\\'+item} />
                          :item
                      }
                    </a>
                  </Card>
                );
              })
            : ""}
        </List>
      </>
    );
  }
}

export default Home;
