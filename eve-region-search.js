const Cc = Components.classes;
const Ci = Components.interfaces;

const CLASS_ID = Components.ID("{787242ef-1931-4c67-89c1-e3e534581153}");
const CLASS_NAME = "EVE Region Autocomplete";
const CONTRACT_ID = "@mozilla.org/autocomplete/search;1?name=region-autocomplete";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const ALL_REGIONS = ["A821-A", "Aridia", "Black Rise", "Branch", "Cache",
	"Catch", "Cloud Ring", "Cobalt Edge", "Curse", "Deklein", "Delve",
	"Derelik", "Detorid", "Devoid", "Domain", "Esoteria", "Essence",
	"Etherium Reach", "Everyshore", "Fade", "Feythabolis", "Fountain",
	"Geminate", "Genesis", "Great Wildlands", "Heimatar", "Immensea",
	"Impass", "Insmother", "J7HZ-F", "Kador", "Khanid", "Kor-Azor",
	"Lonetrek", "Malpais", "Metropolis", "Molden Heath", "Oasa",
	"Omist", "Outer Passage", "Outer Ring", "Paragon Soul", "Period Basis",
	"Perrigen Falls", "Placid", "Providence", "Pure Blind", "Querious",
	"Scalding Pass", "Sinq Laison", "Solitude", "Stain", "Syndicate",
	"Tash-Murkon", "Tenal", "Tenerifis", "The Bleak Lands", "The Citadel",
	"The Forge", "The Kalevala Expanse", "The Spire", "Tribute", "UUA-F4",
	"Vale of the Silent", "Venal", "Verge Vendor", "Wicked Creek"
];

// Implements nsIAutoCompleteResult
function RegionAutoCompleteResult(searchString, searchResult,
                                  defaultIndex, errorDescription,
                                  results) {
	this._searchString = searchString;
	this._searchResult = searchResult;
	this._defaultIndex = defaultIndex;
	this._errorDescription = errorDescription;
	this._results = results;
}

RegionAutoCompleteResult.prototype = {
	_searchString: "",
	_searchResult: 0,
	_defaultIndex: 0,
	_errorDescription: "",
	_results: [],

	get searchString() { return this._searchString; },
	get searchResult() { return this._searchResult; },
	get defaultIndex() { return this._defaultIndex; },
	get errorDescription() { return this._errorDescription; },
	get matchCount() { return this._results.length; },
	getValueAt: function(index) { return this._results[index]; },
	getCommentAt: function(index) { return ""; },
	getStyleAt: function(index) { return null },
	getImageAt : function (index) { return ""; },
	removeValueAt: function(index, removeFromDb) {
    	this._results.splice(index, 1);
  	},

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIAutoCompleteResult])
};

// Implements nsIAutoCompleteSearch
function RegionAutoCompleteSearch() {}

RegionAutoCompleteSearch.prototype = {
	startSearch: function(searchString, searchParam, result, listener) {
		var sslc = searchString.toLowerCase();
		var ssl = searchString.length;
		var results = ssl
				? ALL_REGIONS.filter(function (rn) {
						return rn.substr(0, ssl).toLowerCase() == sslc;	})
				: ALL_REGIONS;

    	var newResult = new RegionAutoCompleteResult(searchString,
    			Ci.nsIAutoCompleteResult.RESULT_SUCCESS, 0, "", results);
    	listener.onSearchResult(this, newResult);
	},

	stopSearch: function() {},

	QueryInterface: XPCOMUtils.generateQI([Ci.nsIAutoCompleteSearch]),
};

// Factory
var RegionAutoCompleteSearchFactory = {
	singleton: null,
	createInstance: function (aOuter, aIID) {
		if (aOuter != null)
			throw Components.results.NS_ERROR_NO_AGGREGATION;
		if (this.singleton == null)
			this.singleton = new RegionAutoCompleteSearch();
		return this.singleton.QueryInterface(aIID);
	}
};

// Module
var RegionAutoCompleteSearchModule = {
	registerSelf: function (aCompMgr, aFileSpec, aLocation, aType) {
		aCompMgr = aCompMgr.QueryInterface(Ci.nsIComponentRegistrar);
		aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, CONTRACT_ID,
				aFileSpec, aLocation, aType);
	},

	unregisterSelf: function (aCompMgr, aLocation, aType) {
		aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
		aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);        
	},
  
	getClassObject: function (aCompMgr, aCID, aIID) {
		if (!aIID.equals(Ci.nsIFactory))
			throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

		if (aCID.equals(CLASS_ID))
			return RegionAutoCompleteSearchFactory;

		throw Components.results.NS_ERROR_NO_INTERFACE;
	},

	canUnload: function (aCompMgr) { return true; }
};

// Module initialization
function NSGetModule(aCompMgr, aFileSpec) { return RegionAutoCompleteSearchModule; }
