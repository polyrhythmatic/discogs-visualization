var labelName = [];
var artName = [];
var yearName = [];
var releaseName = [];

var xPos = [];
var yPos = [];
var time = [];

var pages = 0;

artConcordance = new Concordance();
labelConcordance = new Concordance();

//yearConcordance = new Concordance();
//releaseConcordance = new Concordance();

var userName;


var allReleases = [];

//var somerelease = new ReleaseInfo("somelabel","prince");
//addReleases.push(_____);

function releaseContainer(label, artist, year, name){
  this.label = label;
  this.artist = artist;
  this.year = year;
  this.name = name;
}

function Concordance() {
  this.hash = {};
  this.keys = [];


  this.getCount = function(word){
  	return this.hash[word];
   }

  this.processData = function(data){
  	for(var i = 0; i <= data.length-1; i++){
	  	if(this.hash[data[i]] == undefined){
	  		this.hash[data[i]] = 1;
	  		this.keys.push(data[i]);

	  	} else{
	  		this.hash[data[i]]++;
	  	}
	}  	
  }

  this.getKeys = function(int) {
  	return this.keys[int];
	}
}

function init(){
	document.getElementById('discogs').addEventListener('change', function() {
	userName = document.getElementById('discogs').value
	console.log(userName); 
	});
	document.getElementById('submit').addEventListener('click', pageNumberLoad);
}

function pageNumberLoad(){
$.getJSON('https://api.discogs.com/users/'+userName+'/collection/folders/0/releases?per_page=100&page=1').done(function(data) {
   		gotData(data);
  	}
  );
}

var numCalls = 1;

function gotData(releaseInfo){
	pages = releaseInfo.pagination.pages;
	console.log(pages)
	for(var i = 1; i <=pages; i++){
		loadAPI(i);
		
	}
}

function loadAPI(num){
	setTimeout(function(){
		$.getJSON('https://api.discogs.com/users/'+userName+'/collection/folders/0/releases?per_page=100&page='+num).done(function(data) {
	   				gotRelease(data, num);
	  			}
	 	 	);
	}, num*1000);
}

function gotRelease(releaseInfo, num){
	var perPage = releaseInfo.pagination.per_page; //usually 100
	var items = releaseInfo.pagination.items; //total number of releases
	var page = releaseInfo.pagination.page

	if(perPage*page <= items){

	var countTill = perPage;

		}else{
			var countTill = perPage -((perPage*page) - items);
		}

	console.log(countTill);
	for (var i =0; i <= countTill-1; i++){

		labelName.push(releaseInfo.releases[i].basic_information.labels[0].name);
   		artName.push(releaseInfo.releases[i].basic_information.artists[0].name);
   		yearName.push(releaseInfo.releases[i].basic_information.year);
   		releaseName.push(releaseInfo.releases[i].basic_information.title.name);
	} 
	if(num == pages){
		setup();
	}
}


function setup(){
	console.log("setup")
	createCanvas(windowWidth,windowHeight);
	textSize(12);
	textAlign(CENTER);
	fill(0);
	noStroke();
	//colorMode(HSB,255);

	artConcordance.processData(artName);
	labelConcordance.processData(labelName);

	for (var i = 0; i < labelConcordance.keys.length-1; i++){
  		xPos[i] = random(200, width - 200);
  		yPos[i] = random(50, height - 50);
  		time[i] = random(0,1000);
	}

	for (var i = 0; i < artName.length; i++){
		var release = new releaseContainer(labelName[i], artName[i], yearName[i], releaseName[i]);
		console.log(release);
		allReleases.push(release);
	}

}


function draw(){
  fill(255,255,255,180);
  rect(-1,-1, width+1, height+1);

  for(var i = 0; i <=labelConcordance.keys.length-1; i++){
    
    time[i] += 0.001;

    xPos[i] += map(noise(time[i]), 0, 1, -0.5, 0.5);
    yPos[i] += map(noise(time[i]), 0, 1, -0.5, 0.5);

    var label = labelConcordance.getKeys(i);
    //textSize(10 * labelConcordance.getCount(label));
    fill(209,66,75,100);
    ellipse(xPos[i], yPos[i],40*labelConcordance.getCount(label),40*labelConcordance.getCount(label))
    fill(0);
    text(label, xPos[i], yPos[i]);
   }   
 
}
