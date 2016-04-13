function noNg() {
    throw new Error('AngularJS v1.x is not loaded!');
}
var angular = {
    bootstrap: noNg,
    module: noNg,
    element: noNg,
    version: noNg,
    resumeBootstrap: noNg,
    getTestability: noNg
};
try {
    if (window.hasOwnProperty('angular')) {
        angular = window.angular;
    }
}
catch (e) {
}
export var bootstrap = angular.bootstrap;
export var module = angular.module;
export var element = angular.element;
export var version = angular.version;
export var resumeBootstrap = angular.resumeBootstrap;
export var getTestability = angular.getTestability;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcl9qcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVzJtNENpeDEudG1wL2FuZ3VsYXIyL3NyYy91cGdyYWRlL2FuZ3VsYXJfanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUhBO0lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCxJQUFJLE9BQU8sR0FPRTtJQUNQLFNBQVMsRUFBRSxJQUFJO0lBQ2YsTUFBTSxFQUFFLElBQUk7SUFDWixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsZUFBZSxFQUFFLElBQUk7SUFDckIsY0FBYyxFQUFFLElBQUk7Q0FDckIsQ0FBQztBQUdOLElBQUksQ0FBQztJQUNILEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sR0FBUyxNQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2xDLENBQUM7QUFDSCxDQUFFO0FBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUViLENBQUM7QUFFRCxPQUFPLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDekMsT0FBTyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ25DLE9BQU8sSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUNyQyxPQUFPLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDckMsT0FBTyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ3JELE9BQU8sSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgSU1vZHVsZSB7XG4gIGNvbmZpZyhmbjogYW55KTogSU1vZHVsZTtcbiAgZGlyZWN0aXZlKHNlbGVjdG9yOiBzdHJpbmcsIGZhY3Rvcnk6IGFueSk6IElNb2R1bGU7XG4gIGNvbXBvbmVudChzZWxlY3Rvcjogc3RyaW5nLCBjb21wb25lbnQ6IElDb21wb25lbnQpOiBJTW9kdWxlO1xuICBjb250cm9sbGVyKG5hbWU6IHN0cmluZywgdHlwZTogYW55KTogSU1vZHVsZTtcbiAgZmFjdG9yeShrZXk6IHN0cmluZywgZmFjdG9yeUZuOiBhbnkpOiBJTW9kdWxlO1xuICB2YWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IElNb2R1bGU7XG4gIHJ1bihhOiBhbnkpOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQ29tcGlsZVNlcnZpY2Uge1xuICAoZWxlbWVudDogRWxlbWVudCB8IE5vZGVMaXN0IHwgc3RyaW5nLCB0cmFuc2NsdWRlPzogRnVuY3Rpb24pOiBJTGlua0ZuO1xufVxuZXhwb3J0IGludGVyZmFjZSBJTGlua0ZuIHtcbiAgKHNjb3BlOiBJU2NvcGUsIGNsb25lQXR0YWNoRm4/OiBGdW5jdGlvbiwgb3B0aW9ucz86IElMaW5rRm5PcHRpb25zKTogdm9pZDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSUxpbmtGbk9wdGlvbnMge1xuICBwYXJlbnRCb3VuZFRyYW5zY2x1ZGVGbj86IEZ1bmN0aW9uO1xuICB0cmFuc2NsdWRlQ29udHJvbGxlcnM/OiB7W2tleTogc3RyaW5nXTogYW55fTtcbiAgZnV0dXJlUGFyZW50RWxlbWVudD86IE5vZGU7XG59XG5leHBvcnQgaW50ZXJmYWNlIElSb290U2NvcGVTZXJ2aWNlIHtcbiAgJG5ldyhpc29sYXRlPzogYm9vbGVhbik6IElTY29wZTtcbiAgJGlkOiBzdHJpbmc7XG4gICR3YXRjaChleHByOiBhbnksIGZuPzogKGExPzogYW55LCBhMj86IGFueSkgPT4gdm9pZCk6IEZ1bmN0aW9uO1xuICAkYXBwbHkoKTogYW55O1xuICAkYXBwbHkoZXhwOiBzdHJpbmcpOiBhbnk7XG4gICRhcHBseShleHA6IEZ1bmN0aW9uKTogYW55O1xuICAkJGNoaWxkVGFpbDogSVNjb3BlO1xuICAkJGNoaWxkSGVhZDogSVNjb3BlO1xuICAkJG5leHRTaWJsaW5nOiBJU2NvcGU7XG59XG5leHBvcnQgaW50ZXJmYWNlIElTY29wZSBleHRlbmRzIElSb290U2NvcGVTZXJ2aWNlIHt9XG5leHBvcnQgaW50ZXJmYWNlIElBbmd1bGFyQm9vdHN0cmFwQ29uZmlnIHt9XG5leHBvcnQgaW50ZXJmYWNlIElEaXJlY3RpdmUge1xuICBjb21waWxlPzogSURpcmVjdGl2ZUNvbXBpbGVGbjtcbiAgY29udHJvbGxlcj86IGFueTtcbiAgY29udHJvbGxlckFzPzogc3RyaW5nO1xuICBiaW5kVG9Db250cm9sbGVyPzogYm9vbGVhbiB8IE9iamVjdDtcbiAgbGluaz86IElEaXJlY3RpdmVMaW5rRm4gfCBJRGlyZWN0aXZlUHJlUG9zdDtcbiAgbmFtZT86IHN0cmluZztcbiAgcHJpb3JpdHk/OiBudW1iZXI7XG4gIHJlcGxhY2U/OiBib29sZWFuO1xuICByZXF1aXJlPzogYW55O1xuICByZXN0cmljdD86IHN0cmluZztcbiAgc2NvcGU/OiBhbnk7XG4gIHRlbXBsYXRlPzogYW55O1xuICB0ZW1wbGF0ZVVybD86IGFueTtcbiAgdGVybWluYWw/OiBib29sZWFuO1xuICB0cmFuc2NsdWRlPzogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBJRGlyZWN0aXZlQ29tcGlsZUZuIHtcbiAgKHRlbXBsYXRlRWxlbWVudDogSUF1Z21lbnRlZEpRdWVyeSwgdGVtcGxhdGVBdHRyaWJ1dGVzOiBJQXR0cmlidXRlcyxcbiAgIHRyYW5zY2x1ZGU6IElUcmFuc2NsdWRlRnVuY3Rpb24pOiBJRGlyZWN0aXZlUHJlUG9zdDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSURpcmVjdGl2ZVByZVBvc3Qge1xuICBwcmU/OiBJRGlyZWN0aXZlTGlua0ZuO1xuICBwb3N0PzogSURpcmVjdGl2ZUxpbmtGbjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSURpcmVjdGl2ZUxpbmtGbiB7XG4gIChzY29wZTogSVNjb3BlLCBpbnN0YW5jZUVsZW1lbnQ6IElBdWdtZW50ZWRKUXVlcnksIGluc3RhbmNlQXR0cmlidXRlczogSUF0dHJpYnV0ZXMsXG4gICBjb250cm9sbGVyOiBhbnksIHRyYW5zY2x1ZGU6IElUcmFuc2NsdWRlRnVuY3Rpb24pOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQ29tcG9uZW50IHtcbiAgYmluZGluZ3M/OiBPYmplY3Q7XG4gIGNvbnRyb2xsZXI/OiBhbnk7XG4gIGNvbnRyb2xsZXJBcz86IHN0cmluZztcbiAgcmVxdWlyZT86IGFueTtcbiAgdGVtcGxhdGU/OiBhbnk7XG4gIHRlbXBsYXRlVXJsPzogYW55O1xuICB0cmFuc2NsdWRlPzogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBJQXR0cmlidXRlcyB7ICRvYnNlcnZlKGF0dHI6IHN0cmluZywgZm46ICh2OiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkOyB9XG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2NsdWRlRnVuY3Rpb24ge1xuICAvLyBJZiB0aGUgc2NvcGUgaXMgcHJvdmlkZWQsIHRoZW4gdGhlIGNsb25lQXR0YWNoRm4gbXVzdCBiZSBhcyB3ZWxsLlxuICAoc2NvcGU6IElTY29wZSwgY2xvbmVBdHRhY2hGbjogSUNsb25lQXR0YWNoRnVuY3Rpb24pOiBJQXVnbWVudGVkSlF1ZXJ5O1xuICAvLyBJZiBvbmUgYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoZW4gaXQncyBhc3N1bWVkIHRvIGJlIHRoZSBjbG9uZUF0dGFjaEZuLlxuICAoY2xvbmVBdHRhY2hGbj86IElDbG9uZUF0dGFjaEZ1bmN0aW9uKTogSUF1Z21lbnRlZEpRdWVyeTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSUNsb25lQXR0YWNoRnVuY3Rpb24ge1xuICAvLyBMZXQncyBoaW50IGJ1dCBub3QgZm9yY2UgY2xvbmVBdHRhY2hGbidzIHNpZ25hdHVyZVxuICAoY2xvbmVkRWxlbWVudD86IElBdWdtZW50ZWRKUXVlcnksIHNjb3BlPzogSVNjb3BlKTogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBJQXVnbWVudGVkSlF1ZXJ5IHtcbiAgYmluZChuYW1lOiBzdHJpbmcsIGZuOiAoKSA9PiB2b2lkKTogdm9pZDtcbiAgZGF0YShuYW1lOiBzdHJpbmcsIHZhbHVlPzogYW55KTogYW55O1xuICBpbmhlcml0ZWREYXRhKG5hbWU6IHN0cmluZywgdmFsdWU/OiBhbnkpOiBhbnk7XG4gIGNvbnRlbnRzKCk6IElBdWdtZW50ZWRKUXVlcnk7XG4gIHBhcmVudCgpOiBJQXVnbWVudGVkSlF1ZXJ5O1xuICBsZW5ndGg6IG51bWJlcjtcbiAgW2luZGV4OiBudW1iZXJdOiBOb2RlO1xufVxuZXhwb3J0IGludGVyZmFjZSBJUGFyc2VTZXJ2aWNlIHsgKGV4cHJlc3Npb246IHN0cmluZyk6IElDb21waWxlZEV4cHJlc3Npb247IH1cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbXBpbGVkRXhwcmVzc2lvbiB7IGFzc2lnbihjb250ZXh0OiBhbnksIHZhbHVlOiBhbnkpOiBhbnk7IH1cbmV4cG9ydCBpbnRlcmZhY2UgSUh0dHBCYWNrZW5kU2VydmljZSB7XG4gIChtZXRob2Q6IHN0cmluZywgdXJsOiBzdHJpbmcsIHBvc3Q/OiBhbnksIGNhbGxiYWNrPzogRnVuY3Rpb24sIGhlYWRlcnM/OiBhbnksIHRpbWVvdXQ/OiBudW1iZXIsXG4gICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuKTogdm9pZDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSUNhY2hlT2JqZWN0IHtcbiAgcHV0PFQ+KGtleTogc3RyaW5nLCB2YWx1ZT86IFQpOiBUO1xuICBnZXQoa2V5OiBzdHJpbmcpOiBhbnk7XG59XG5leHBvcnQgaW50ZXJmYWNlIElUZW1wbGF0ZUNhY2hlU2VydmljZSBleHRlbmRzIElDYWNoZU9iamVjdCB7fVxuZXhwb3J0IGludGVyZmFjZSBJQ29udHJvbGxlclNlcnZpY2Uge1xuICAoY29udHJvbGxlckNvbnN0cnVjdG9yOiBGdW5jdGlvbiwgbG9jYWxzPzogYW55LCBsYXRlcj86IGFueSwgaWRlbnQ/OiBhbnkpOiBhbnk7XG4gIChjb250cm9sbGVyTmFtZTogc3RyaW5nLCBsb2NhbHM/OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUluamVjdG9yU2VydmljZSB7IGdldChrZXk6IHN0cmluZyk6IGFueTsgfVxuXG5leHBvcnQgaW50ZXJmYWNlIElUZXN0YWJpbGl0eVNlcnZpY2Uge1xuICBmaW5kQmluZGluZ3MoZWxlbWVudDogRWxlbWVudCwgZXhwcmVzc2lvbjogc3RyaW5nLCBvcHRfZXhhY3RNYXRjaD86IGJvb2xlYW4pOiBFbGVtZW50W107XG4gIGZpbmRNb2RlbHMoZWxlbWVudDogRWxlbWVudCwgZXhwcmVzc2lvbjogc3RyaW5nLCBvcHRfZXhhY3RNYXRjaD86IGJvb2xlYW4pOiBFbGVtZW50W107XG4gIGdldExvY2F0aW9uKCk6IHN0cmluZztcbiAgc2V0TG9jYXRpb24odXJsOiBzdHJpbmcpOiB2b2lkO1xuICB3aGVuU3RhYmxlKGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQ7XG59XG5cbmZ1bmN0aW9uIG5vTmcoKSB7XG4gIHRocm93IG5ldyBFcnJvcignQW5ndWxhckpTIHYxLnggaXMgbm90IGxvYWRlZCEnKTtcbn1cblxudmFyIGFuZ3VsYXI6XG4gICAge1xuICAgICAgYm9vdHN0cmFwOiAoZTogRWxlbWVudCwgbW9kdWxlczogc3RyaW5nW10sIGNvbmZpZzogSUFuZ3VsYXJCb290c3RyYXBDb25maWcpID0+IHZvaWQsXG4gICAgICBtb2R1bGU6IChwcmVmaXg6IHN0cmluZywgZGVwZW5kZW5jaWVzPzogc3RyaW5nW10pID0+IElNb2R1bGUsXG4gICAgICBlbGVtZW50OiAoZTogRWxlbWVudCkgPT4gSUF1Z21lbnRlZEpRdWVyeSxcbiAgICAgIHZlcnNpb246IHttYWpvcjogbnVtYmVyfSwgcmVzdW1lQm9vdHN0cmFwPzogKCkgPT4gdm9pZCxcbiAgICAgIGdldFRlc3RhYmlsaXR5OiAoZTogRWxlbWVudCkgPT4gSVRlc3RhYmlsaXR5U2VydmljZVxuICAgIH0gPSA8YW55PntcbiAgICAgIGJvb3RzdHJhcDogbm9OZyxcbiAgICAgIG1vZHVsZTogbm9OZyxcbiAgICAgIGVsZW1lbnQ6IG5vTmcsXG4gICAgICB2ZXJzaW9uOiBub05nLFxuICAgICAgcmVzdW1lQm9vdHN0cmFwOiBub05nLFxuICAgICAgZ2V0VGVzdGFiaWxpdHk6IG5vTmdcbiAgICB9O1xuXG5cbnRyeSB7XG4gIGlmICh3aW5kb3cuaGFzT3duUHJvcGVydHkoJ2FuZ3VsYXInKSkge1xuICAgIGFuZ3VsYXIgPSAoPGFueT53aW5kb3cpLmFuZ3VsYXI7XG4gIH1cbn0gY2F0Y2ggKGUpIHtcbiAgLy8gaWdub3JlIGluIENKUyBtb2RlLlxufVxuXG5leHBvcnQgdmFyIGJvb3RzdHJhcCA9IGFuZ3VsYXIuYm9vdHN0cmFwO1xuZXhwb3J0IHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZTtcbmV4cG9ydCB2YXIgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudDtcbmV4cG9ydCB2YXIgdmVyc2lvbiA9IGFuZ3VsYXIudmVyc2lvbjtcbmV4cG9ydCB2YXIgcmVzdW1lQm9vdHN0cmFwID0gYW5ndWxhci5yZXN1bWVCb290c3RyYXA7XG5leHBvcnQgdmFyIGdldFRlc3RhYmlsaXR5ID0gYW5ndWxhci5nZXRUZXN0YWJpbGl0eTtcbiJdfQ==