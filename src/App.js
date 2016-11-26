import React, { Component } from 'react';
import { MuiThemeProvider } from 'material-ui/styles';
import { Drawer, AppBar, RaisedButton } from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import Player from './Player';
import Editor from './Editor';
import String from './String';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      playing: false,
      text: '1-2-3-4-5\n-4-5-6-7-8',
    };
  }
  updateText = text => this.setState({ text })
  toggleDrawer = () => this.setState({ open: !this.state.open });
  togglePlayer = () => this.refs.player.toggle();

  render = () =>
    <MuiThemeProvider>
      <div>
        <AppBar title="React Songs"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.toggleDrawer}
          zDepth={2}
        />
        <Drawer
          docked={false} open={this.state.open}
          onRequestChange={(open) => this.setState({open})} >
        </Drawer>
        <RaisedButton onClick={this.togglePlayer} >
          {this.state.playing ? 'Stop' : 'Play'}
        </RaisedButton>
        <Editor ref='editor' options={{ lineNumbers: true }} update={this.updateText}>
          {this.state.text}
        </Editor>
        <Player ref='player' playing={this.state.playing} >
          {this.state.text.split('\n').map((line, i) =>
            <String key={i} line={line} />
          )}
        </Player>
      </div>
    </MuiThemeProvider>
}

export default App;
