window.helper = null;
window.closer = null;

if ( typeof( ghelper ) == 'undefined' || typeof( ghelper.proactive_timeout ) == 'undefined' ) {
	window.ghelper = {
		proactive_timeout: 5000
	};		
}

function focusHelper() {
	clearInterval( window.helper );
	window.helper = null;
	
	window.helper = setInterval( function() {
		if ( window.messenger_opened ) {
			$('.helper').css({ "visibility": "hidden" }).removeClass( 'animate__tada animate__animated' );
			clearInterval( window.helper );
			return false;
		}
		
		$('.helper').css({ "visibility": "visible" }).removeClass( 'animate__tada' );
		setTimeout( function() { $('.helper').addClass( 'animate__animated animate__tada' ) }, 100 );
	}, ghelper.proactive_timeout );
}

function openTopic( messenger_topic ) {
	Genesys("command", "Database.set", {
		messaging: {
			customAttributes: {
				topic: messenger_topic,
			}
		}
	});
	
	window.messenger_opened = true;
	$('.helper').css({ "visibility": "hidden" }).removeClass( 'animate__tada animate__animated' );
	$('.share, .fab').removeClass( 'active' );
	Genesys( "command", "Messenger.open" );
}

$(document).ready( function() {
	$(".share, .fab").mouseover( function( e ) {
		clearTimeout( window.closer );
		window.closer = null;
		clearInterval( window.helper );
		$('.helper').css({ "visibility": "hidden" }).removeClass( 'animate__tada animate__animated' );
			
		if ( window.messenger_opened ) {
			return false;
		} else {
			$('.share, .fab').addClass( 'active' );
			$('.fab span').css( 'display', 'flex' );
		}
	});

	$(".share, .fab").mouseout( function( e ) {
		clearTimeout( window.closer );
		window.closer = null;
		window.closer = setTimeout( function() {
			$('.share, .fab').removeClass( 'active' );
			$('.fab span').css( 'display', 'none' );
			
			if ( window.messenger_opened ) {
				return false;
			} else {
				focusHelper();
			}
		}, 200 );
	});

	$(".share:visible").click( function( e ) {
		toggleMessenger();
	});
	
	if ( typeof( ghelper ) == 'undefined' || typeof( ghelper.proactive_timeout ) == 'undefined' ) {
		window.ghelper = {
			proactive_timeout: 4000
		};		
	}
	
	focusHelper();
	
	$('#my_account').click( function() {
		openTopic( "my_account" );
	});
	
	$('#order_checks').click( function() {
		openTopic( "order_checks" );
	});
	
	$('#dispute_charge').click( function() {
		openTopic( "dispute_charge" );
	});
	
	/** Genesys Events **/
	Genesys( "subscribe", "Messenger.closed", function( e ) {
		window.messenger_opened = false;
		focusHelper();
	});
	
	Genesys( "subscribe", "Messenger.opened", function( e ) {
		window.messenger_opened = true;
	});

	Genesys( "subscribe", "Database.updated", function( e ) {
		console.log( e.data );
	});
});