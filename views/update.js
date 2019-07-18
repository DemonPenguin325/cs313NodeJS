function addRace(name){
    var url = "/data/race/" + name;
	//console.log("Mode: " + mode);
	req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
            console.log(req.responseText);
            var info = JSON.parse(req.responseText);
            var race_data = "<p class='box-subtitle'>"+ ucfirst(info[0].race_name) +": </p>";
            race_data += "<p class='box-text'>Description: "+ info[0].race_description +"</p>";
            race_data += "<p class='box-text'>Base HP: "+ info[0].race_hp +"</p>";
            race_data += "<p class='box-text'>Abilities: "+(typeof info[0].race_rules === 'undefined' ? info[0].race_rules : "None")+"</p>";

            document.getElementById("race-info").innerHTML = race_data;
            //document.getElementById("stats-info").innerHTML = info[0].stats;
        }
    }
    req.open("GET", url, true);
	req.send();
}
function setClass(name){
    var url = "/data/class/" + name
	//console.log("Mode: " + mode);
	req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
            console.log(req.responseText);
            var info = JSON.parse(req.responseText);
            var class_data = "<p class='box-subtitle'>"+ ucfirst(info[0].class_name) +": </p>";
            class_data += "<p class='box-text'>Description: "+ info[0].class_description +"</p>";
            class_data += "<p class='box-text'>Bonus HP: "+ info[0].class_hp +"</p>";
            class_data += "<p class='box-text'>Abilities: "+(typeof info[0].class_rules === 'undefined' ? info[0].class_rules : "None")+"</p>";

            document.getElementById("class-info").innerHTML = class_data;
            //document.getElementById("stats-info").innerHTML = info[0].stats;
        }
    }

    req.open("GET", url, true);
	req.send();
}
function getEditInfo(){
    var value = document.getElementById("editSelector").value;
    value = value.split(';');
    var kind = value[0];
    var name = value[1];
    var url = "getEditInfo?";
    url += "kind=" + kind;
    url += "&name=" + name;
	//console.log("Mode: " + mode);
	req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
            console.log(req.responseText);
            var info = JSON.parse(req.responseText);
            addEditFields(kind, info);
        }
    }
    req.open("GET", url, true);
	req.send();
}

function addAdditionFields(){
    var kind = document.getElementById("addSelector").value;
    var fieldArea = document.getElementById("addFields");
    var output = "";
    if (kind == "race"){
        output += '<label>Name: </label><input type="text" name="name" class="form-field" required><br>';
        output += '<label>Base HP: </label><input type="number" name="hp" class="form-field"><br>';
        output += '<label>Special Rules: </label><input type="text" name="rules" class="form-field"><br>';
        output += '<label>Magic Rules: </label><input type="text" name="magic_rules" class="form-field"><br>';
        output += '<label>Description: </label><input type="text" name="description" class="form-field" required><br>';
    }
    else if (kind == "class"){
        output += '<label>Name: </label><input type="text" name="name" class="form-field" required><br>';
        output += '<label>Bonus HP: </label><input type="number" name="hp" class="form-field"><br>';
        output += '<label>Special Rules: </label><input type="text" name="rules" class="form-field"><br>';
        output += '<label>Type: </label><input type="text" name="type" class="form-field"><br>';
        output += '<label>Description: </label><input type="text" name="description" class="form-field" required><br>';
    }
    else{
        console.log(kind);
    }
    fieldArea.innerHTML = output;
}

function addEditFields(kind, info){
    var fieldArea = document.getElementById("editFields");
    var output = "";
    if (kind == "race"){
        output += '<label>Name: </label><input type="text" name="name" class="form-field" value="' + info.race_name + '" required><br>';
        output += '<label>Base HP: </label><input type="number" name="hp" class="form-field" value="' + (typeof info.race_hp == "number" ? info.race_hp : 5) + '"><br>';
        output += '<label>Special Rules: </label><input type="text" name="rules" class="form-field" value="' + info.race_rules + '"><br>';
        output += '<label>Magic Rules: </label><input type="text" name="magic_rules" class="form-field" value="' + info.race_magic_rule + '"><br>';
        output += '<label>Description: </label><input type="text" name="description" class="form-field" value="' + info.race_description + '" required><br>';
    }
    else if (kind == "class"){
        output += '<label>Name: </label><input type="text" name="name" class="form-field" value="' + info.class_name + '" required><br>';
        output += '<label>Bonus HP: </label><input type="number" name="hp" class="form-field" value="' + (typeof info.class_hp == "number" ? info.class_hp : 0) + '"><br>';
        output += '<label>Special Rules: </label><input type="text" name="rules" class="form-field" value="' + info.class_rules + '"><br>';
        output += '<label>Type: </label><input type="text" name="type" class="form-field" value="' + info.class_type + '"><br>';
        output += '<label>Description: </label><input type="text" name="description" class="form-field" value="' + info.class_description + '" required><br>';
    }
    else{
        console.log(kind);
    }
    fieldArea.innerHTML = output;
}

function doubleCheck(){
    return confirm("Are you sure you want to DELETE \"" + document.getElementById("item-to-delete").value.split(';')[1] + "\"? It will be gone forever! (A very long time)" );
}

function generateMainPage(){
    if (sessionStorage.loggedIn){
        document.getElementById("loginBanner").innerHTML = "<h4>Welcome " + sessionStorage.username + "! <h4>";
        document.getElementById("navbar").innerHTML += "<li><a href='/edit'>Edit</a></li>"
    }
    // Generate Button Options
    raceOptions = document.getElementById("raceOptions")
    req1 = new XMLHttpRequest();
	req1.onreadystatechange = function(){
		if (req1.readyState == 4 && req1.status == 200){
            console.log(req1.responseText);
            var info = JSON.parse(req1.responseText);
            info.forEach(function(element) {
                raceOptions.innerHTML += '<li><a class="dropdown-item" href="#" onclick="addRace(\''+ element.race_name +'\')">'+ ucfirst(element.race_name) +'</a></li>';
              });
        }
    }
    req1.open("GET", '/data/race/name', true);
    req1.send();
    
    classOptions = document.getElementById("classOptions")
    req2 = new XMLHttpRequest();
	req2.onreadystatechange = function(){
		if (req2.readyState == 4 && req2.status == 200){
            console.log(req2.responseText);
            var info = JSON.parse(req2.responseText);
            info.forEach(function(element) {
                classOptions.innerHTML += '<li><a class="dropdown-item" href="#" onclick="setClass(\''+ element.class_name +'\')">'+ ucfirst(element.class_name) +'</a></li>';
              });
        }
    }
    req2.open("GET", '/data/class/name', true);
	req2.send();
}

function generateEditPage(){
    var deleteClassList = document.getElementById("deleteClassList");
    var deleteRaceList = document.getElementById("deleteRaceList");
    var raceList = document.getElementById("race_list");
    req1 = new XMLHttpRequest();
	req1.onreadystatechange = function(){
		if (req1.readyState == 4 && req1.status == 200){
            console.log(req1.responseText);
            var info = JSON.parse(req1.responseText);
            info.forEach(function(element) {
                raceList.innerHTML += '<option value="race;' + element.race_name + '">' + ucfirst(element.race_name) + '</option>'
                deleteRaceList.innerHTML += '<option value="race;' + element.race_name + '">' + ucfirst(element.race_name) + '</option>'
            });
        }
    }
    req1.open("GET", '/data/race/name', true);
    req1.send();

    var classList = document.getElementById("class_list");
    req2 = new XMLHttpRequest();
	req2.onreadystatechange = function(){
		if (req2.readyState == 4 && req2.status == 200){
            console.log(req2.responseText);
            var info = JSON.parse(req2.responseText);
            info.forEach(function(element) {
                classList.innerHTML += '<option value="class;' + element.class_name + '">' + ucfirst(element.class_name) + '</option>'
                deleteClassList.innerHTML += '<option value="class;' + element.class_name + '">' + ucfirst(element.class_name) + '</option>'
            });
        }
    }
    req2.open("GET", '/data/class/name', true);
    req2.send();
}

function authenticate(){
    var params = "username=" + document.getElementById("username").value
    params += "&password=" + document.getElementById("password").value
    //console.log("Params: " + params)
    req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
            var info = JSON.parse(req.responseText);
            if (info.success == true){
                sessionStorage.loggedIn = true
                sessionStorage.username = document.getElementById("username").value
                window.location.href = '/larp'
            }
            else{
                // Error message
                document.getElementById("errorField").innerText = "Your username or password was incorrect!"
            }
        }
    }
    req.open("POST", "/auth", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send(params);
}

// Got from https://dzone.com/articles/how-to-capitalize-the-first-letter-of-a-string-in
function ucfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}