if (useLocalStorage)
{
	var obj = localStorage.getItem("addedComments");
	if (obj != null && obj != "")
	{
	  var Field = document.getElementById("Field");
	  var items = JSON.parse(obj);

	  for (var i = 0; i < items.length; i++)
	  {
		var responseRow = document.createElement("div");
		responseRow.setAttribute("class", "feedback");
		responseRow.innerHTML = items[i];
		Field.appendChild(responseRow);
	  }
	}
	else
	{
	  localStorage.setItem("addedComments", JSON.stringify([]));
	}
}
else
{
	var request_db = indexedDB.open("glush_db");
	var Field = document.getElementById("Field");
	
	request_db.onupgradeneeded = function()
	{
		var db = request_db.result;
		db.createObjectStore("news", {keyPath: 'html'});
		db.createObjectStore("reviews", {keyPath: 'html'});
	}
		
	request_db.onsuccess = function()
	{
		var os = request_db.result.transaction("reviews", "readwrite").objectStore("reviews");
		var request = os.openCursor();
		request.onsuccess = function(event)
		{
			var cursor = event.target.result;
			
			if (cursor)
			{
				var html = cursor.value.html;
				var responseRow = document.createElement("div");
				responseRow.setAttribute("class", "feedback");
				responseRow.innerHTML = html;
				Field.appendChild(responseRow);
				
				cursor.continue();
			}
		}
		
		request.oncomplete = function()
		{
			request_db.result.close();
		}
	};
}

function uploadToServer()
{
    alert("The data has been uploaded to the server!");
}

function onOnline()
{
  var obj = JSON.parse(localStorage.getItem("addedComments"));
  for(var i = 0;  i < obj.length; i++)
  {
	var responseRow = document.createElement("div");
	responseRow.setAttribute("class", "feedback");
	responseRow.innerHTML = obj[i];
	
    var Field = document.getElementById("Field");
	Field.appendChild(responseRow);
  }
  uploadToServer();
  localStorage.setItem("addedComments", JSON.stringify([]))
}

window.addEventListener('online', onOnline);