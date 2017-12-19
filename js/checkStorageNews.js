if (useLocalStorage)
{
	var obj = localStorage.getItem("addedNews");
	if (obj != null && obj != "")
	{
	  var Field = document.getElementById("News");
	  var items = JSON.parse(obj);

	  for (var i = 0; i < items.length; i++)
	  {
		var responseRow = document.createElement("div");
		responseRow.setAttribute("class", "novelty");
		responseRow.innerHTML = items[i];
		Field.appendChild(responseRow);
	  }
	}
	else
	{
	  localStorage.setItem("addedNews", JSON.stringify([]));
	}
}
else
{
	var request_db = indexedDB.open("glush_db");
	var Field = document.getElementById("News");
	
	request_db.onupgradeneeded = function()
	{
		var db = request_db.result;
		db.createObjectStore("news", {keyPath: 'html'});
		db.createObjectStore("reviews", {keyPath: 'html'});
	}
		
	request_db.onsuccess = function()
	{
		var os = request_db.result.transaction("news", "readwrite").objectStore("news");
		var request = os.openCursor();
		request.onsuccess = function(event)
		{
			var cursor = event.target.result;
			
			if (cursor)
			{
				var html = cursor.value.html;
				var responseRow = document.createElement("div");
				responseRow.setAttribute("class", "novelty");
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