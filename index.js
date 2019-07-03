var UVCControl = require('uvc-control');
var HID = require('node-hid');
var usb = require('usb');

console.log('From the [index.js] file...');

var camera2Id;
var vendorId;
var productId;

navigator.mediaDevices.enumerateDevices()
	.then(function (devices) {

		var usbdevices = usb.getDeviceList();
		console.log('&&&&&')
		console.log(usbdevices)
		// var device = usb.findByIds(0x046d, 0x0825);
		usbdevices.map((item) => {
			console.log(item.deviceDescriptor.idVendor.toString(16));
			var vendorIdNew = item.deviceDescriptor.idVendor;
			var productIdNew = item.deviceDescriptor.idProduct;
			if (item.deviceDescriptor.idVendor.toString(16) === '46d') {
				vendorId = '0x0' + vendorIdNew.toString(16);
				productId = '0x0' + productIdNew.toString(16);
				device = usb.findByIds(vendorId, productId);
				console.log(device);
				// device.open();
			}
		})
		console.log('*******', vendorId, productId, HID.devices());
		devices.forEach(function (device) {
			// console.log(device)
			if (device.label === 'Logitech HD Webcam C270 (046d:0825)') {
				console.log(JSON.stringify(device));

				document.getElementById('uvcDevice').innerHTML = device.label;
				document.getElementById('uvcDeviceId').innerHTML = device.deviceId;
				// document.getElementById('uvcDevicePath').innerHTML = hidDevices.path;

				console.table([1, 2, 3, 4, 5]);
				camera2Id = device.deviceId;
				// vendorId = device.vendorId;
				// productId = device.productId;
				// Prefer camera resolution nearest to 1280x720.
				console.log(device.kind + ': ' + device.label + ' id = ' + device.deviceId);
				var constraints = {
					// audio: true,
					video: {
						deviceId: camera2Id
					}
				};

				navigator.mediaDevices
					.getUserMedia(constraints)
					.then(function (mediaStream) {
						var video = document.querySelector('video');
						video.srcObject = mediaStream;
						video.onloadedmetadata = function (e) {
							video.play();
						};
					})
					.catch(function (err) {
						// alert("Not able to access the device, Check if any other application is using the camera");
						console.log(err.name + ': ' + err.message);
						document.getElementById('body').innerHTML =
							"<p style='font-size:100px'> YOUR DEVICE IS NOT FREE</p>";
					})
					.catch(function (err) {
						console.log(err.name + ': ' + err.message);
					});
			}

		});

		var hidDevices = HID.devices();
		hidDevices.filter((hidDevices) => {

			if (hidDevices.product === 'S720 Bluetooth Speakerphone') {
				console.log('bluetooth speaker jabra');
				document.getElementById('hidDevice').innerHTML = hidDevices.product;
				document.getElementById('hidDeviceId').innerHTML = hidDevices.productId;
				// document.getElementById('hidDevicePath').innerHTML = hidDevices.path;


			}
		});


	});

function uvcControlDevice() {
	console.log(vendorId, productId);
	var camera = new UVCControl(vendorId, productId);
	console.log(camera);
	camera.get('autoFocus', function (error, value) {
		console.log('AutoFocus setting:', value);
	});
	camera.set('brightness', 100, function (error) {
		if (!error) {
			console.log('Brightness Set OK!');
		} else {
			console.log('Brightness Not Set', error);
		}
	});
	camera.get('sharpness', function (error, value) {
		if (error) return console.log(error);
		console.log('Sharpness is', value);
	});
}
function playVideo() {
	let video = document.querySelector('video');
	video.play();
}

function pauseVideo() {
	let video = document.querySelector('video');
	video.pause();
}
