/*
 *  FreeNAS-Configurator - v. 0.0.1
 *  https://ixsystems.com
 *
 *  Made by Vaclav Navratil
 *  Under MIT License
 */

var machine = {};

$( document ).ready(function() {
    console.log( "ready!" );

	$( "#hdd_size, #hdd_raid, #dram" ).prop( "disabled", true ).val( "" );

    $( "#system4, #system8" ).on( "change", systemChange);

	$( "#hdd_count" ).on( "change", countChange);

	$( "#system4, #system8, #hdd_count, #dram, #read_cache, #write_cache, #nic, #hdd_size, #hdd_raid" ).on( "change", doCalulations);
	

});

function systemChange () {
  	$( "#hdd_count, #dram, #read_cache, #write_cache, #nic" ).prop( "disabled", false );
	if ( $( "#dram" ).val() === null ) {
		$( "#dram" ).val( 16 );
  	} 
  		
  	if ( this.value === "8" ) {
  		$( "#hdd_count" ).val( 8 );
  		$( "#dram" ).val( 32 );
  		$( "#dram option[value='16']" ).prop( "disabled", true );
  		$( "#hdd_count option[value='5']" ).prop( "disabled", false );
  		$( "#hdd_count option[value='6']" ).prop( "disabled", false );
  		$( "#hdd_count option[value='7']" ).prop( "disabled", false );
  		$( "#hdd_count option[value='8']" ).prop( "disabled", false );  		
  	} else if ( this.value === "4" ) {
  		$( "#hdd_count" ).val( 4 );
  		$( "#dram option[value='16']" ).prop( "disabled", false );
  		$( "#hdd_count option[value='5']" ).prop( "disabled", true );
  		$( "#hdd_count option[value='6']" ).prop( "disabled", true );
  		$( "#hdd_count option[value='7']" ).prop( "disabled", true );
  		$( "#hdd_count option[value='8']" ).prop( "disabled", true );
  	}
  	
  	$( "#hdd_count" ).change();
}

function countChange () {
	if ( this.value > 1) {
		$( "#hdd_size, #hdd_raid" ).prop( "disabled", false );
		$( "#hdd_raid option" ).prop( "disabled", false );
		if ( $( "#hdd_raid" ).val() === null ) {
			$( "#hdd_raid" ).val( "Z1" );
  		} 
		if ( $( "#hdd_size" ).val() === null ) {
			$( "#hdd_size" ).val( "4" );
  		} 
	} else if ( this.value > 0) {
		$( "#hdd_size" ).prop( "disabled", false );
		$( "#hdd_raid" ).prop( "disabled", true ).val( "" );	
		if ( $( "#hdd_size" ).val() === null ) {
			$( "#hdd_size" ).val( "4" );
  		}
  		return; 
	} else {
		$( "#hdd_size, #hdd_raid" ).prop( "disabled", true ).val( "" );
		return;
	}

	if ( this.value < 4 ) {
		$( "#hdd_raid option[value='Z3']" ).prop( "disabled", true );
		$( "#hdd_raid option[value='10']" ).prop( "disabled", true );
		$( "#hdd_raid" ).val( "Z1" );
	}

	if ( this.value < 3 ) {
		$( "#hdd_raid option[value='Z2']" ).prop( "disabled", true );
		$( "#hdd_raid" ).val( "Z1" );
	}
}

function doCalulations() {
	serializeForm();
	calculateTotalPrize();
	calculateSpace();
}

function serializeForm () {
	var get = $( "#fnc_form" ).serialize();
	machine = $( "#fnc_form" ).serializeObject();
	$( "#get_output" ).text(get);
	$( "#json_output" ).text(JSON.stringify(machine));
}

function calculateTotalPrize () {
	var total = 0.00;
	if (machine.read_cache === "yes") {
		total += 145.00;
	}

	if (machine.write_cache === "yes") {
		total += 115.00;
	}

	if (machine.nic === "yes") {
		total += 150.00;
	}

	if (machine.system === "4") {
		total += 999.99;

		switch(machine.dram) {
		    case "16":
		        total += 0; 
		        break;
		    case "32":
		        total += 150.00;
		        break;
		    case "64":
		        total += 200.00;
		        break;
		}

		switch(machine.hdd_size) {
		    case "0":
		        total += (machine.hdd_count*0); 
		        break;
		    case "1":
		        total += (machine.hdd_count*71.25);
		        break;
		    case "2":
		        total += (machine.hdd_count*100.00);
		        break;
		    case "3":
		        total += (machine.hdd_count*125.00);
		        break;
		    case "4":
		        total += (machine.hdd_count*175.00);
		        break;
		    case "6":
		        total += (machine.hdd_count*312.00);
		        break;			        		        
		}

	} else if (machine.system === "8") {
		total += 1499.99;

		switch(machine.dram) {
		    case "32":
		        total += 0.00;
		        break;
		    case "64":
		        total += 200.00;
		        break;
		}

		switch(machine.hdd_size) {
		    case "0":
		        total += (machine.hdd_count*0); 
		        break;
		    case "1":
		        total += (machine.hdd_count*81.25);
		        break;
		    case "2":
		        total += (machine.hdd_count*106.25);
		        break;
		    case "3":
		        total += (machine.hdd_count*125.00);
		        break;
		    case "4":
		        total += (machine.hdd_count*162.00);
		        break;
		    case "6":
		        total += (machine.hdd_count*287.50);
		        break;			        		        
		}

	} else {
		total = "N/A"; //This should not ever happened!
	}

	$( "#total b" ).text("$" + (Math.round((total + 0.00001) * 100) / 100).toFixed(2)); 
}

function calculateSpace () {
	var usableCoeficient = {
								"1":"0.914",
								"2":"1.814",
								"3":"2.443",
								"4":"3.643",
								"6":"5.457"
							};

	var raw = machine.hdd_count * machine.hdd_size;
	var realUsable;
	var marketedUsable;

	console.log((machine.hdd_count-1) * usableCoeficient[machine.hdd_size]);
	console.log(Math.round((((machine.hdd_count-1) * usableCoeficient[machine.hdd_size])) * 100) / 100);
	
	switch(machine.hdd_raid) {
		case "10":
			realUsable = machine.hdd_count * (usableCoeficient[machine.hdd_size]/2);
			marketedUsable = raw/2;
			break;
		case "Z1":
			realUsable = (machine.hdd_count-1) * usableCoeficient[machine.hdd_size];
			marketedUsable = (machine.hdd_count-1) * machine.hdd_size;
	    	break;
		case "Z2":
			realUsable = (machine.hdd_count-2) * usableCoeficient[machine.hdd_size];
			marketedUsable = (machine.hdd_count-2) * machine.hdd_size;
	    	break;
		case "Z3":
			realUsable = (machine.hdd_count-3) * usableCoeficient[machine.hdd_size];
			marketedUsable = (machine.hdd_count-3) * machine.hdd_size;
	    	break;	    		    	
	}
	$( "#raw b" ).text((Math.round((raw + 0.00001) * 100) / 100).toFixed(2) + " TB");
	$( "#usable b" ).text((Math.round((realUsable + 0.00001) * 100) / 100).toFixed(2) + " TB");
	$( "#marketed b" ).text((Math.round((marketedUsable + 0.00001) * 100) / 100).toFixed(2) + " TB");
}