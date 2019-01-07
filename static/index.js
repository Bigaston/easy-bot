let codeArea = new CodeFlask('#textarea', {
	language: 'js',
	lineNumbers: true
})

//codeArea.updateCode(code)
  
codeArea.onUpdate( e => console.log(e))