function exportToExcel(tableId){
	let tableData = document.getElementById(tableId).outerHTML;
    tableData = tableData.replace(/<img[^>]*>/gi,""); //povolit když chceme obrázky
	tableData = tableData.replace(/<A[^>]*>|<\/A>/g, ""); //odstranit jestli chceme links 
    tableData = tableData.replace(/<input[^>]*>|<\/input>/gi, ""); //odstraní input parametry

	tableData = tableData

	//po kliknutí se stáhne
	let a = document.createElement('a')
	let dataType = 'data:application/vnd.ms-excel';
	a.href = `data:application/vnd.ms-excel, ${encodeURIComponent(tableData)}`
	a.download = 'Seznam knížek' + '.xls'
	a.click()
}