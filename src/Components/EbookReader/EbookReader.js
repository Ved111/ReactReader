import React, { Component, useContext } from "react";
import { createGlobalStyle } from "styled-components";
import FileReaderInput from "react-file-reader-input";
import { ReactReader } from "./modules";
import axios from 'axios';
import {
  Container,
  ReaderContainer,
  Bar,
  LogoWrapper,
  Logo,
  GenericButton,
  CloseIcon,
  FontSizeButton,
  ButtonWrapper
} from "./Components";
import { AuthContext } from '../../Context/AuthContext';
import queryString from 'query-string';

const storage = global.localStorage || null;

const urlParams = new URLSearchParams(window.location.search)


var DEMO_URL = "" //ebook url
const DEMO_NAME = //urlParams.get("query").split("/")[4].split("by")[0];
"Alice in wonderland";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
`;


export default class EbookReader extends Component {

  
    constructor(props) {
        super(props)
      // Passing the key to the server, which returns the presigned url of ebook, which is stored in s3
        console.log(props.location.state.detail)
        axios.post('//server-url', props.location.state.detail)
          .then(res => {
            console.log(res.data.url);
            if(res.data.success) {
              DEMO_URL = res.data.url
              //console.log("https://gerhardsletten.github.io/react-reader/files/alice.epub")
              console.log(DEMO_URL)
            }
            else{
              alert('Error in getting Url');
            }
          })
        this.state = {
          fullscreen: true,
          location:
            storage && storage.getItem("epub-location")
              ? storage.getItem("epub-location")
              : 2,
          localFile: null,
          localName: null,
          largeText: false
        };
        this.rendition = null;
    }
    toggleFullscreen = () => {
        this.setState(
          {
            fullscreen: !this.state.fullscreen
          },
          () => {
            setTimeout(() => {
              const evt = document.createEvent("UIEvents");
              evt.initUIEvent("resize", true, false, global, 0);
            }, 1000);
          }
        );
      };

      onLocationChanged = location => {
        this.setState(
          {
            location
          },
          () => {
            storage && storage.setItem("epub-location", location);
          }
        );
      };

      onToggleFontSize = () => {
        const nextState = !this.state.largeText;
        this.setState(
          {
            largeText: nextState
          },
          () => {
            this.rendition.themes.fontSize(nextState ? "140%" : "100%");
          }
        );
      };

      getRendition = rendition => {
        // Set inital font-size, and add a pointer to rendition for later updates
        const { largeText } = this.state;
        this.rendition = rendition;
        rendition.themes.fontSize(largeText ? "140%" : "100%");
        
      };

      handleChangeFile = (event, results) => {
        if (results.length > 0) {
          const [e, file] = results[0];
          if (file.type !== "application/epub+zip") {
            return alert("Unsupported type");
          }
          this.setState({
            localFile: e.target.result,
            localName: file.name,
            location: null
          });
        }
      };

      render() {
        const { fullscreen, location, localFile, localName } = this.state;
        return (
          <Container>
            <GlobalStyle />
            <Bar>
              <ButtonWrapper>
                <FileReaderInput as="buffer" onChange={this.handleChangeFile}>
                  <GenericButton>Upload local epub</GenericButton>
                </FileReaderInput>
                <GenericButton onClick={this.toggleFullscreen}>
                  Use full browser window
                  <CloseIcon />
                </GenericButton>
              </ButtonWrapper>
            </Bar>
            <ReaderContainer fullscreen={fullscreen}>
            <ReactReader 
                url = {DEMO_URL}
                //{localFile || DEMO_URL }
                title={localName || DEMO_NAME}
                location={location}
                locationChanged={this.onLocationChanged}
                getRendition={this.getRendition}
              />
              <FontSizeButton onClick={this.onToggleFontSize}>
                Toggle font-size
              </FontSizeButton>
            </ReaderContainer>
          </Container>
        );
      }
}
