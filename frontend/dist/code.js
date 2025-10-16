var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
figma.showUI(__html__, {
    width: 400,
    height: 600,
    themeColors: true
});
figma.ui.onmessage = function (msg) { return __awaiter(_this, void 0, void 0, function () {
    var text, center;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(msg.type === 'create-text')) return [3 /*break*/, 2];
                text = figma.createText();
                return [4 /*yield*/, figma.loadFontAsync({ family: "Inter", style: "Regular" })];
            case 1:
                _a.sent();
                text.characters = msg.text;
                center = figma.viewport.center;
                text.x = center.x - (text.width / 2);
                text.y = center.y - (text.height / 2);
                figma.currentPage.appendChild(text);
                figma.currentPage.selection = [text];
                figma.viewport.scrollAndZoomIntoView([text]);
                figma.notify("Created: ".concat(msg.text));
                _a.label = 2;
            case 2:
                // Future message handlers for AI Copilot features
                if (msg.type === 'generate-feedback-response') {
                    // TODO: Connect to AI backend for response generation
                    figma.notify('Feedback response generation - coming soon!');
                }
                if (msg.type === 'run-design-review') {
                    // TODO: Connect to AI backend for design review
                    figma.notify('Design review analysis - coming soon!');
                }
                if (msg.type === 'ask-knowledge-base') {
                    // TODO: Connect to knowledge base API
                    figma.notify('Knowledge base query - coming soon!');
                }
                if (msg.type === 'create-jira-ticket') {
                    // TODO: Connect to Jira API
                    figma.notify('Jira ticket creation - coming soon!');
                }
                return [2 /*return*/];
        }
    });
}); };
