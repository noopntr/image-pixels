import React from 'react'

const Comp = React.createClass({
    getInitialState() {
      return {files: []}
    },
    onFilesDropped(files) {
      let newFiles = files.map((file) => {
        return {
          name: file.name,
          uploaded: false
        }
      })
      this.setState({files: this.state.files.concat(newFiles)})
    },
    render() {
      return (
        <div>
          <Droparea onFilesDropped={this.onFilesDropped} />
          <FileList files={this.state.files} />
        </div>
      )
    }
  });
  
  const Droparea = React.createClass({
    getInitialState() {
      return {isDragging: false}
    },
    onDragLeave() {
      this.setState({isDragging: false})
    },
    onDrop(e) {
      e.preventDefault()
      this.setState({isDragging: false})
      let files = this.mapFileListToArray(e.dataTransfer.files)
      this.props.onFilesDropped(files)
    },
    onDragOver(e) {
      e.preventDefault()
      this.setState({isDragging: true})
    },
    mapFileListToArray(fileList) {
      let fl = fileList.length
      let files = []
      for (let i = 0; i < fl; i++) {
        files.push(fileList[i])
      }
      return files
    },
    render() {
      let dropareaClasses = "file-uploader__droparea";
      dropareaClasses += this.state.isDragging ? ' is-highlighted' : '';
      return (
        <div
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
          className={dropareaClasses}
        >
          <span className="file-uploader__droparea-info">Drop your file here</span>
        </div>
      )
    }
  });
  
  const FileList = (props) => {
    let files = props.files.map((file, i) => {
      return <File key={i} name={file.name} uploaded={file.uploaded} />;
    });
    return <ul>{files}</ul>
  }
  
  const File = (props) => {
    return <li><b>{props.name}</b></li>
  }
  
  File.propTypes = {
    id: React.PropTypes.number,
    name: React.PropTypes.string.isRequired,
    uploaded: React.PropTypes.bool.isRequired
  }

export default Comp
