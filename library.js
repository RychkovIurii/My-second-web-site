const navSubs = document.querySelectorAll(".nav-sub");
const navID = document.getElementById("nav-toggle");
const navBar = document.querySelector('.navigation');

navID.addEventListener("click", () => {
	navBar.classList.toggle("show-nav");
	if (navBar.classList.contains("show-nav")) {
		navSubs.forEach(navSub => {
			const long = navSub.querySelector(".long");
			const toggleIcon = navSub.querySelector(".short img");
			long.style.display = "none";
			toggleIcon.style.transform = "";
		});
	}
	});

navSubs.forEach((navSub) => {
	const short = navSub.querySelector(".short");
	const long = navSub.querySelector(".long");
	const toggleIcon = short.querySelector("img");

	short.addEventListener("click", () => {
		navSubs.forEach((otherNavSub) => {
			if (otherNavSub !== navSub) {
				otherNavSub.querySelector(".long").style.display = "none";
				otherNavSub.querySelector("img").style.transform = "";
			}
		});

		const isExpanded = long.style.display === "block";
		long.style.display = isExpanded ? "none" : "block";
		toggleIcon.style.transform = isExpanded ? "" : "rotate(180deg)";
	});
});

const darkToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
darkToggle.addEventListener('click', () => {
	body.classList.toggle('dark-mode');
	const toggleOffIcon = document.getElementById('toggle-off');
	const toggleOnIcon = document.getElementById('toggle-on');
	const isDark = body.classList.contains('dark-mode');
	localStorage.setItem('darkMode', isDark);
	if (isDark) {
		toggleOffIcon.style.display = 'none';
		toggleOnIcon.style.display = 'inline-block';
	} else {
		toggleOffIcon.style.display = 'inline-block';
		toggleOnIcon.style.display = 'none';
	}
});

const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
	body.classList.add('dark-mode');
	const toggleOffIcon = document.getElementById('toggle-off');
	const toggleOnIcon = document.getElementById('toggle-on');
	toggleOffIcon.style.display = 'none';
	toggleOnIcon.style.display = 'inline-block';
}

function searchISBN() {
	const isbn = document.getElementById("isbnID").value;
	fetch(`https://openlibrary.org/isbn/${isbn}.json`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response is not ok');
			}
			return response.json();
		})
		.then(data => {
			if (data.title && data.publish_date && data.authors) {
				//const resultElement = document.getElementById("result");
				//resultElement.innerHTML = "";
				//console.log(resultElement);
				const coverElement = document.getElementById("coverDiv");
				coverElement.innerHTML = "";
				//console.log(coverElement);
				if (data.covers && data.covers.length > 0){
					const imgElement = document.createElement("img");
					imgElement.id = "myCover";
					fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`).then(temp => {
						return temp.blob();
						}).then(myPicture => {
							const imageUrl = URL.createObjectURL(myPicture);
							imgElement.src = imageUrl;
							coverElement.appendChild(imgElement);
						});
				}
				const authorKeys = data.authors.map(author => author.key);
				//console.log(authorKeys);
				const authorPromises = authorKeys.map(element => {
					return fetch(`https://openlibrary.org${element}.json`)
						.then(response => {
							if (!response.ok) {
								throw new Error('Network response is not ok');
							}
							return response.json();
						});
				});
				Promise.all(authorPromises)
					.then(authorData => {
						const authors = authorData.map(author => author.name);
						document.getElementById("coverDiv").innerHTML =
							"<h3>Title is " + data.title +
							".</h3><p>Publish date is " + data.publish_date +
							".</p><p>Written by " + authors.join(", ") + ".</p><br>";
						//console.log(authors);
					})
					.catch(error => {
						console.error("Error fetching author data:", error);
					});
			} else {
				document.getElementById("coverDiv").innerHTML = "Book data not found";
			}
		})
		.catch(error => {
			alert("Something went wrong. " + error);
		});
}

/*                         const bookURL = data[0].thumbnail_url;			//draft for img
					if (bookURL) {
						const resultElement = document.getElementById("result");
						const imgElement = document.createElement("img");
						imgElement.id = "myCover";
						fetch(`${bookURL}`).then(temp => {
							return temp.blob();
						}).then(myPicture => {
							const imageUrl = URL.createObjectURL(myPicture);
							imgElement.src = imageUrl;
							const resultElement = document.getElementById("result");
						resultElement.appendChild(imgElement);
						});
					} */

/* async function searchISBN() {											//without img
	const isbn = document.getElementById("isbnID").value;
	try {
	const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
	if (!response.ok) {
		throw new Error('Network response is not ok');
	}
	const data = await response.json();

	if (data.title && data.publish_date && data.authors) {
		const authorKeys = data.authors.map(author => author.key);
		const authors = [];
		for (const key of authorKeys) {
			const authorResponse = await fetch(`https://openlibrary.org${key}.json`);
			if (!authorResponse.ok) {
				throw new Error('Network response is not ok');
			}
			const authorData = await authorResponse.json();
			authors.push(authorData.name);
		}
		document.getElementById("result").innerHTML =
			"Title is " + data.title +
			". Publish date is " + data.publish_date +
			". Written by " + authors.join(", ");
		console.log(authors);
	} else {
		document.getElementById("result").innerHTML = "Book data not found";
	}
	} catch (error) {
	alert("Something went wrong. " + error);
	}
} */

/* function searchISBN() { 														//the first draft
	console.log("Yes1");
	const isbn = document.getElementById("isbnID").value;
	console.log(isbn);
	fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`)
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		console.log("Yes2");
		return response.json();
	})
	.then(data => {
		console.log(data);
		//document.getElementById("result").innerHTML = "Title is " + data[`ISBN:${isbn}`].title; 
	})
	.catch(error => {
		alert("Something went wrong. " + error);
	});
} */




/* async function searchISBN() {										//same behaviour like mine. Tried re-write with async
	const isbn = document.getElementById("isbnID").value;
	const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
	if (!response.ok) {
		throw new Error('Network response is not ok');
	}
	const data = await response.json();
	if (data.title && data.publish_date && data.authors) {
		const resultElement = document.getElementById("result");
		resultElement.innerHTML = "";
		//console.log(resultElement);
		const coverElement = document.getElementById("coverDiv");
		coverElement.innerHTML = "";
		//console.log(coverElement);
		if (data.covers && data.covers.length > 0){
			const imgElement = document.createElement("img");
			imgElement.id = "myCover";
			const temp = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
			const myPicture = await temp.blob();
				const imageUrl = URL.createObjectURL(myPicture);
				imgElement.src = imageUrl;
				coverElement.appendChild(imgElement);
		}
		const authorKeys = data.authors.map(author => author.key);
		const authors = [];
		for (const key of authorKeys) {
			const authorResponse = await fetch(`https://openlibrary.org${key}.json`);
			if (!authorResponse.ok) {
				throw new Error('Network response is not ok');
			}
			const authorData = await authorResponse.json();
			authors.push(authorData.name);
		}
		document.getElementById("result").innerHTML =
			"<h3>Title is " + data.title +
			".</h3><p>Publish date is " + data.publish_date +
			".</p><p>Written by " + authors.join(", ") + ".</p><br>";
		//console.log(authors);
	} else {
		document.getElementById("result").innerHTML = "Book data not found";
	}
} */