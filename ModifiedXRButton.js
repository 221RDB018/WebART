/**
 * A utility class for creating a button that allows to initiate
 * immersive XR sessions based on WebXR. The button can be created
 * with a factory method and then appended to the website's DOM.
 *
 * ```js
 * document.body.appendChild( ModifiedXRButton.createButton( renderer ) );
 * ```
 *
 * Compared to {@link ARButton} and {@link VRButton}, this class will
 * try to offer an immersive AR session first. If the device does not
 * support this type of session, it uses an immersive VR session.
 *
 * This modified version allows the use of custom CSS classes instead of inline styles.
 */
class ModifiedXRButton {

	/**
	 * Constructs a new XR button with custom CSS classes.
	 *
	 * @param {WebGLRenderer|WebGPURenderer} renderer - The renderer.
	 * @param {XRSessionInit} [sessionInit] - The configuration object for the AR session.
	 * @param {Object} [styleOptions] - Style options for the button.
	 * @return {HTMLElement} The button or an error message if WebXR isn't supported.
	 */
	static createButton( renderer, sessionInit = {}, styleOptions = {} ) {

		const button = document.createElement( 'button' );
		
		// Apply custom classes
		button.className = styleOptions.className || 'w-full mb-3';
		
		// Apply custom variant if provided or use default
		if (styleOptions.variant) {
			button.setAttribute('data-variant', styleOptions.variant);
		} else {
			button.setAttribute('data-variant', 'default');
		}

		function showStartXR( mode ) {

			let currentSession = null;

			async function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				await renderer.xr.setSession( session );

				button.textContent = styleOptions.stopText || 'STOP XR';

				currentSession = session;

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = styleOptions.startText || 'Launch WebAR Experience';

				currentSession = null;

			}

			//
			button.style.display = '';

			button.textContent = styleOptions.startText || 'Launch WebAR Experience';

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
			button.disabled = true;
			button.classList.add('disabled');

			button.onclick = null;

		}

		function showXRNotSupported() {

			disableButton();

			button.textContent = styleOptions.notSupportedText || 'XR NOT SUPPORTED';

		}

		function showXRNotAllowed( exception ) {

			disableButton();

			console.warn( 'Exception when trying to call xr.isSessionSupported', exception );

			button.textContent = styleOptions.notAllowedText || 'XR NOT ALLOWED';

		}

		if ( 'xr' in navigator ) {

			button.id = styleOptions.id || 'XRButton';

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
			message.className = styleOptions.className || 'w-full mb-3';

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = styleOptions.needsHttpsText || 'WEBXR NEEDS HTTPS';

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = styleOptions.notAvailableText || 'WEBXR NOT AVAILABLE';

			}

			return message;

		}

	}

}

export { ModifiedXRButton };