function addRace(name){
    var url = "update.php?";
	url += "race=" + name;
	//console.log("Mode: " + mode);
	req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
            console.log(req.responseText);
            var info = JSON.parse(req.responseText);
            document.getElementById("race-info").innerHTML = info.race;
            document.getElementById("stats-info").innerHTML = info.stats;
        }
    }
    req.open("GET", url, true);
	req.send();
}
function setClass(name){
    var url = "update.php?";
	url += "class=" + name;
	//console.log("Mode: " + mode);
	req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
            console.log(req.responseText);
            var info = JSON.parse(req.responseText);
            document.getElementById("class-info").innerHTML = info.class;
            document.getElementById("stats-info").innerHTML = info.stats;
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
    var url = "updateInfo.php?";
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
        output += '<label>Base HP: </label><input type="number" name="hp" class="form-field" value="' + (info.race_hp == null ? info.race_hp : 5) + '"><br>';
        output += '<label>Special Rules: </label><input type="text" name="rules" class="form-field" value="' + info.race_rules + '"><br>';
        output += '<label>Magic Rules: </label><input type="text" name="magic_rules" class="form-field" value="' + info.race_magic_rule + '"><br>';
        output += '<label>Description: </label><input type="text" name="description" class="form-field" value="' + info.race_description + '" required><br>';
    }
    else if (kind == "class"){
        output += '<label>Name: </label><input type="text" name="name" class="form-field" value="' + info.class_name + '" required><br>';
        output += '<label>Bonus HP: </label><input type="number" name="hp" class="form-field" value="' + (info.class_hp == null ? info.class_hp : 0) + '"><br>';
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
    return confirm("Are you sure you want to DELETE \"" + document.getElementById("item-to-delete").value + "\"? It will be gone forever! (A very long time)" );
}