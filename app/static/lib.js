class TMScrollTracking {
	_handlers = [];

	constructor() {
		this._scrollHandler = this._scrollHandler.bind(this);
		this._addListener();
	}

	register(scrollPoints, callback) {
		this._handlers.push(
			new TMSTHandler(callback, {
				points: scrollPoints,
				highestPointOnly: false,
			})
		);
	}

	registerForHighestPointOnly(scrollPoints, callback) {
		this._handlers.push(
			new TMSTHandler(callback, {
				points: scrollPoints,
				highestPointOnly: true,
			})
		);
	}

	registerHandler(handler) {
		this._handlers.push(handler);
	}

	_scrollHandler(e) {
		for (let handlers of this._handlers) {
			handlers._update(this._currentScrollPercentage());
		}
	}

	_currentScrollPercentage() {
		const docHeight = document.body.scrollHeight;
		const pos = document.documentElement.scrollTop + window.innerHeight;
		return Math.round((pos / docHeight) * 100);
	}

	_addListener() {
		window.addEventListener("scroll", this._scrollHandler, { passive: true });
	}
}

class TMSTHandler {
	defaultConfig = {
		points: [25, 50, 75, 100],
	};

	_currentConfig;
	_triggeredPoints = new Set();

	constructor(handler, config = this.defaultConfig) {
		this._validateConfig(config);
		this._currentConfig = config;
		if (typeof handler == "function") this.trigger = handler;
	}

	trigger(scrollPoint) {
		console.warn(
			"TMSTHandler: using default handler, to trigger tracking calls pass in the callback function"
		);
		console.log(`Triggered scroll point: ${scrollPoint}`);
	}

	_update(scrollPct) {
		const caughtScrollPoints = this._currentScrollPoints(scrollPct);
		const untrigerredScrollPoints = caughtScrollPoints.filter(
			(pt) => !this._triggeredPoints.has(pt)
		);
		let maxScrollPoint = 0;
		const highestPointOnly = this._currentConfig.highestPointOnly;
		if (highestPointOnly) {
			maxScrollPoint = Math.max.apply(this, untrigerredScrollPoints);
		}
		for (let pt of untrigerredScrollPoints) {
			if (!highestPointOnly || (highestPointOnly && pt == maxScrollPoint))
				this.trigger(pt);
			this._triggeredPoints.add(pt);
		}
	}

	_currentScrollPoints(scrollPct) {
		return this._currentConfig.points.filter((pt) => pt <= scrollPct);
	}

	_validateConfig(config) {
		if (!(config.points instanceof Array)) {
			throw new Error(
				"TMScrollTracking: config object doesn't contain required `points` array"
			);
		}
		if (config.points.length === 0)
			console.warn(
				"TMScrollTracking: point's array is empty, the tracking will not work"
			);
	}
}

window.tmScrollTracking = new TMScrollTracking();
window.tmScrollTracking.register(
	[10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
	function (scrollPoint) {
		console.log("Triggering new tealium call with scroll point:", scrollPoint);
	}
);
