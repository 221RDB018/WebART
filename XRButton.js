/**
 * A utility class for creating a button that allows to initiate
 * immersive XR sessions based on WebXR. The button can be created
 * with a factory method and then appended ot the website's DOM.
 *
 * ```js
 * document.body.appendChild( XRButton.createButton( renderer ) );
 * ```
 *
 * Compared to {@link ARButton} and {@link VRButton}, this class will
 * try to offer an immersive AR session first. If the device does not
 * support this type of session, it uses an immersive VR session.
 *
 * @hideconstructor
 * @three_import import { XRButton } from 'three/addons/webxr/XRButton.js';
 */
class XRButton {

	/**
	 * Constructs a new XR button.
	 *
	 * @param {WebGLRenderer|WebGPURenderer} renderer - The renderer.
	 * @param {XRSessionInit} [sessionInit] - The a configuration object for the AR session.
	 * @param {Object} [options] - Additional options for the button.
	 * @param {boolean} [options.applyDefaultClass=true] - Whether to apply the default 'xr-button' class to the button.
	 * @return {HTMLElement} The button or an error message if WebXR isn't supported.
	 */
	static createButton( renderer, sessionInit = {}, options = {} ) {

		const button = document.createElement( 'button' );
		button.id = 'XRButton';
		
		// Apply default class if not disabled
		if (options.applyDefaultClass !== false) {
			button.classList.add('xr-button');
		}

		function showStartXR( mode ) {

			let currentSession = null;

			async function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				await renderer.xr.setSession( session );

				button.textContent = 'STOP XR';
				button.classList.add('xr-button-active');

				currentSession = session;

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'START XR';
				button.classList.remove('xr-button-active');

				currentSession = null;

			}

			//
			button.style.display = '';
			button.textContent = 'START XR';

			const sessionOptions = {
				...sessionInit,
				optionalFeatures: [
					'local-floor',
					'bounded-floor',
					'layers',
					...( sessionInit.optionalFeatures || [] )
				],
			};

			button.onclick = function () {

				if ( currentSession === null ) {

					navigator.xr.requestSession( mode, sessionOptions )
						.then( onSessionStarted );

				} else {

					currentSession.end();

					if ( navigator.xr.offerSession !== undefined ) {

						navigator.xr.offerSession( mode, sessionOptions )
							.then( onSessionStarted )
							.catch( ( err ) => {

								console.warn( err );

							} );

					}

				}

			};

			if ( navigator.xr.offerSession !== undefined ) {

				navigator.xr.offerSession( mode, sessionOptions )
					.then( onSessionStarted )
					.catch( ( err ) => {

						console.warn( err );

					} );

			}

		}

		function disableButton() {

			button.style.display = '';
			button.classList.add('xr-button-disabled');
			button.onclick = null;

		}

		function showXRNotSupported() {

			disableButton();
			button.textContent = 'XR NOT SUPPORTED';

		}

		function showXRNotAllowed( exception ) {

			disableButton();
			console.warn( 'Exception when trying to call xr.isSessionSupported', exception );
			button.textContent = 'XR NOT ALLOWED';

		}

		if ( 'xr' in navigator ) {

			button.style.display = 'none';

			navigator.xr.isSessionSupported( 'immersive-ar' )
				.then( function ( supported ) {

					if ( supported ) {

						showStartXR( 'immersive-ar' );

					} else {

						navigator.xr.isSessionSupported( 'immersive-vr' )
							.then( function ( supported ) {

								if ( supported ) {

									showStartXR( 'immersive-vr' );

								} else {

									showXRNotSupported();

								}

							} ).catch( showXRNotAllowed );

					}

				} ).catch( showXRNotAllowed );

			return button;

		} else {

			const message = document.createElement( 'a' );
			
			if (options.applyDefaultClass !== false) {
				message.classList.add('xr-message');
			}

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS';

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}

			return message;

		}

	}

}

export { XRButton };