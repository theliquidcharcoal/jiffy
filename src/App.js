import React, {Component} from 'react';
import loader from './images/loader.svg';
import Gif from './gif-comp.js';
import clearIcon from './images/close-icon.svg';

// Function for Random Selection 
const randomSelect = arr => {
	const randIndex = Math.floor(Math.random() * arr.length);
	return arr[randIndex]
	console.log(arr[randIndex])
}



// Header Component

// We pick out our props inside the header component
// we can pass down functions as props as well as things
// like numbers, strings, arrays or objects.
const Header = ({clearSearch, hasResult}) => (
	<div className="header grid">

		{hasResult 
			? 
			<button onClick={clearSearch}>
				<img src={clearIcon} /> 
			</button>
			: 
			<h1 className="title" onClick={clearSearch} >Jiffy</h1> }

	</div>

);

const UserHint = ({loading, hintText}) => (
	<div className="user-hint">
		{	loading ? 
			<img className="block mx-auto" src={loader} /> : 
			<span className="">{hintText}</span>
		}
	</div>

)

class App extends Component {

	constructor(props){
		super(props)

		// create a ref to store the textInput DOM element
		this.textInput = React.createRef();
		
		this.state = {
			loading: false,
			searchTerm: '',
			hintText: '',
			gif: null,
			// We have an array of GIFs here
			gifs: []
		}
	}

	// We awnt a function that searches the giphy api using
	// fetch and puts the search term into the query url and
	// then we can do something with the results

	//We can also write async methods into our components
	//that let us use the async/await style of function

	searchGiphy = async searchTerm => {
		//First we try our fetch
		this.setState({
			// Here we set our loading state to be true
			// and this will show the spinner at the bottom
			loading: true
		});
		try{
			//here we use the await keyword to wait for our response to comeback.
			const response = await fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=dmo1TAE8ufvIIqWpugW6aTY15isD27Sd&q=${searchTerm}&limit=250&offset=0&rating=G&lang=en`
			);
    		
    		// here we convert our raw response into json data
    		// const {data} gets the .data part of our response
    		const {data} = await response.json();

    		// Here we check if the array of result is empty
    		// if it is, we throw an error which will stop the
    		// code here and handle it in the catch area
    		if(!data.length){
    			throw `Nothing found for ${searchTerm}`
    		}


    		// hrere we grab random result from our images
    		const randomGif = randomSelect(data);
    		// console.log({randomGif});
    		// console.log(data)


    		this.setState((prevState, props) => ({
    			...prevState,
    			// get the first result and put in the state.
    			gif: randomGif,
    			// Here we use our spread to take the previous gifs and 
    			// spread them out, and then add our new random gif.
    			// onto the end of the gifs array.
    			gifs: [...prevState.gifs, randomGif],
    			//we turnoff our loading spinner again
    			loading: false,
    			hintText: `Hit enter to see more ${searchTerm}`

    		}))

		  // If fetch fails, we catch it down here.
		} catch (error) {
			this.setState((prevState, props) => ({
				...prevState,
				hintText: `Ughhh Crap! Try Google ${searchTerm}.`,
				loading: false
			}))
			console.log(error)
		}
	}




	// with create-react-app we can write our methods as arrow functions,
	// meaning we don't need the constructor and bind

	handleChange = event => {
		

		const {value} = event.target; // console.log(event.target.value);

		// by setting the search term in our state and also using that
		// on the input as the value, we have created what is called
		// a controlled input
		this.setState((prevState, props) => ({

				//We take our old props and spread them out here
				...prevState,
				// then we overwrite the ones we want after
				searchTerm: value,
				hintText: value.length > 2 ? `Hit Enter to search ${value}` : ''


			})

		)



		// if(value.length > 2){
		// 	// console.log("this is valid search term");
		// } 
	};

	//When we have 2 or more chareacters in our search box
	// and we have also pressed enter, we then want to run search.

	handleKeyPress = event => {
		const {value} = event.target
		console.log(event.key);

		if(value.length > 2 && event.key === 'Enter'){
			// alert(`search for ${value}`);
			//here we call our searchGiphy function using the search term.
			this.searchGiphy(value);

		} else {
			if(event.key === 'Enter'){
				alert(`Please enter more than 2 characters`);
			}
		}
	};

	// Here we reset our set by clearing everything out,
	// Making it default again
	clearSearch = () => {
		this.setState((prevState, props) => ({
			...prevState,
			searchTerm: '',
			hintText: '',
			gifs: []
		}));
		// Here we grab the input and then focus the cursor back into it.
		this.textInput.current.focus();

	}


	
	render(){
		const {searchTerm, gifs} = this.state //const searchTerm = this.state.searchTerm
		// Here 
		const hasResult = gifs.length

	  	return (
		    <div className="page">
		      	<Header clearSearch={this.clearSearch} hasResult={hasResult}/>	

		  		{/*Search Box*/}
		  		<div className="search grid">
		  			<input 
		  				type="text" 
		  				className="input db py3" 
		  				placeholder="Type Something" 
		  				onChange={this.handleChange}
		  				onKeyPress={this.handleKeyPress}
		  				value={searchTerm}
		  				ref={this.textInput}
		  			/>
		  			{/*Our Stack of GIF images
		  			 Here we loop over our array of gif images from our state and we create multiple videos from it.*/}
		  			{/*
		  				Its only going to render our video when we have a gif in the state, we can test for it using &&
		  			*/}
		  			
		  			{/*
		  				gif && <video className="db video" autoPlay={true} loop
							src={this.state.gif.images.original.mp4} />
					*/}

		  			{this.state.gifs.map(

		  				gif => (
		  					<Gif {...gif} />

						
						)
	  				)}

		  		</div>
		  		{/*Here we pass our userHint all of our state using a spread*/}
		  		<UserHint {...this.state} />

		    </div>
  		);
	}
}

export default App;
