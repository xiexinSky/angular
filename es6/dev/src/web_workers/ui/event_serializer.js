import { Set } from 'angular2/src/facade/collection';
import { isPresent } from 'angular2/src/facade/lang';
const MOUSE_EVENT_PROPERTIES = [
    "altKey",
    "button",
    "clientX",
    "clientY",
    "metaKey",
    "movementX",
    "movementY",
    "offsetX",
    "offsetY",
    "region",
    "screenX",
    "screenY",
    "shiftKey"
];
const KEYBOARD_EVENT_PROPERTIES = [
    'altkey',
    'charCode',
    'code',
    'ctrlKey',
    'isComposing',
    'key',
    'keyCode',
    'location',
    'metaKey',
    'repeat',
    'shiftKey',
    'which'
];
const TRANSITION_EVENT_PROPERTIES = ['propertyName', 'elapsedTime', 'pseudoElement'];
const EVENT_PROPERTIES = ['type', 'bubbles', 'cancelable'];
const NODES_WITH_VALUE = new Set(["input", "select", "option", "button", "li", "meter", "progress", "param"]);
export function serializeGenericEvent(e) {
    return serializeEvent(e, EVENT_PROPERTIES);
}
// TODO(jteplitz602): Allow users to specify the properties they need rather than always
// adding value and files #3374
export function serializeEventWithTarget(e) {
    var serializedEvent = serializeEvent(e, EVENT_PROPERTIES);
    return addTarget(e, serializedEvent);
}
export function serializeMouseEvent(e) {
    return serializeEvent(e, MOUSE_EVENT_PROPERTIES);
}
export function serializeKeyboardEvent(e) {
    var serializedEvent = serializeEvent(e, KEYBOARD_EVENT_PROPERTIES);
    return addTarget(e, serializedEvent);
}
export function serializeTransitionEvent(e) {
    var serializedEvent = serializeEvent(e, TRANSITION_EVENT_PROPERTIES);
    return addTarget(e, serializedEvent);
}
// TODO(jteplitz602): #3374. See above.
function addTarget(e, serializedEvent) {
    if (NODES_WITH_VALUE.has(e.target.tagName.toLowerCase())) {
        var target = e.target;
        serializedEvent['target'] = { 'value': target.value };
        if (isPresent(target.files)) {
            serializedEvent['target']['files'] = target.files;
        }
    }
    return serializedEvent;
}
function serializeEvent(e, properties) {
    var serialized = {};
    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];
        serialized[prop] = e[prop];
    }
    return serialized;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfc2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVzJtNENpeDEudG1wL2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy91aS9ldmVudF9zZXJpYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0NBQWdDO09BQzNDLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCO0FBRWxELE1BQU0sc0JBQXNCLEdBQUc7SUFDN0IsUUFBUTtJQUNSLFFBQVE7SUFDUixTQUFTO0lBQ1QsU0FBUztJQUNULFNBQVM7SUFDVCxXQUFXO0lBQ1gsV0FBVztJQUNYLFNBQVM7SUFDVCxTQUFTO0lBQ1QsUUFBUTtJQUNSLFNBQVM7SUFDVCxTQUFTO0lBQ1QsVUFBVTtDQUNYLENBQUM7QUFFRixNQUFNLHlCQUF5QixHQUFHO0lBQ2hDLFFBQVE7SUFDUixVQUFVO0lBQ1YsTUFBTTtJQUNOLFNBQVM7SUFDVCxhQUFhO0lBQ2IsS0FBSztJQUNMLFNBQVM7SUFDVCxVQUFVO0lBQ1YsU0FBUztJQUNULFFBQVE7SUFDUixVQUFVO0lBQ1YsT0FBTztDQUNSLENBQUM7QUFFRixNQUFNLDJCQUEyQixHQUFHLENBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUVyRixNQUFNLGdCQUFnQixHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUUzRCxNQUFNLGdCQUFnQixHQUNsQixJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBRXpGLHNDQUFzQyxDQUFRO0lBQzVDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVELHdGQUF3RjtBQUN4RiwrQkFBK0I7QUFDL0IseUNBQXlDLENBQVE7SUFDL0MsSUFBSSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxvQ0FBb0MsQ0FBYTtJQUMvQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCx1Q0FBdUMsQ0FBZ0I7SUFDckQsSUFBSSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCx5Q0FBeUMsQ0FBa0I7SUFDekQsSUFBSSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCx1Q0FBdUM7QUFDdkMsbUJBQW1CLENBQVEsRUFBRSxlQUFxQztJQUNoRSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQWUsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxNQUFNLEdBQXFCLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDeEMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQztRQUNwRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNwRCxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFDekIsQ0FBQztBQUVELHdCQUF3QixDQUFNLEVBQUUsVUFBb0I7SUFDbEQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzNDLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NldH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7aXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5jb25zdCBNT1VTRV9FVkVOVF9QUk9QRVJUSUVTID0gW1xuICBcImFsdEtleVwiLFxuICBcImJ1dHRvblwiLFxuICBcImNsaWVudFhcIixcbiAgXCJjbGllbnRZXCIsXG4gIFwibWV0YUtleVwiLFxuICBcIm1vdmVtZW50WFwiLFxuICBcIm1vdmVtZW50WVwiLFxuICBcIm9mZnNldFhcIixcbiAgXCJvZmZzZXRZXCIsXG4gIFwicmVnaW9uXCIsXG4gIFwic2NyZWVuWFwiLFxuICBcInNjcmVlbllcIixcbiAgXCJzaGlmdEtleVwiXG5dO1xuXG5jb25zdCBLRVlCT0FSRF9FVkVOVF9QUk9QRVJUSUVTID0gW1xuICAnYWx0a2V5JyxcbiAgJ2NoYXJDb2RlJyxcbiAgJ2NvZGUnLFxuICAnY3RybEtleScsXG4gICdpc0NvbXBvc2luZycsXG4gICdrZXknLFxuICAna2V5Q29kZScsXG4gICdsb2NhdGlvbicsXG4gICdtZXRhS2V5JyxcbiAgJ3JlcGVhdCcsXG4gICdzaGlmdEtleScsXG4gICd3aGljaCdcbl07XG5cbmNvbnN0IFRSQU5TSVRJT05fRVZFTlRfUFJPUEVSVElFUyA9IFsncHJvcGVydHlOYW1lJywgJ2VsYXBzZWRUaW1lJywgJ3BzZXVkb0VsZW1lbnQnXTtcblxuY29uc3QgRVZFTlRfUFJPUEVSVElFUyA9IFsndHlwZScsICdidWJibGVzJywgJ2NhbmNlbGFibGUnXTtcblxuY29uc3QgTk9ERVNfV0lUSF9WQUxVRSA9XG4gICAgbmV3IFNldChbXCJpbnB1dFwiLCBcInNlbGVjdFwiLCBcIm9wdGlvblwiLCBcImJ1dHRvblwiLCBcImxpXCIsIFwibWV0ZXJcIiwgXCJwcm9ncmVzc1wiLCBcInBhcmFtXCJdKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUdlbmVyaWNFdmVudChlOiBFdmVudCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgcmV0dXJuIHNlcmlhbGl6ZUV2ZW50KGUsIEVWRU5UX1BST1BFUlRJRVMpO1xufVxuXG4vLyBUT0RPKGp0ZXBsaXR6NjAyKTogQWxsb3cgdXNlcnMgdG8gc3BlY2lmeSB0aGUgcHJvcGVydGllcyB0aGV5IG5lZWQgcmF0aGVyIHRoYW4gYWx3YXlzXG4vLyBhZGRpbmcgdmFsdWUgYW5kIGZpbGVzICMzMzc0XG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplRXZlbnRXaXRoVGFyZ2V0KGU6IEV2ZW50KToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICB2YXIgc2VyaWFsaXplZEV2ZW50ID0gc2VyaWFsaXplRXZlbnQoZSwgRVZFTlRfUFJPUEVSVElFUyk7XG4gIHJldHVybiBhZGRUYXJnZXQoZSwgc2VyaWFsaXplZEV2ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZU1vdXNlRXZlbnQoZTogTW91c2VFdmVudCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgcmV0dXJuIHNlcmlhbGl6ZUV2ZW50KGUsIE1PVVNFX0VWRU5UX1BST1BFUlRJRVMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplS2V5Ym9hcmRFdmVudChlOiBLZXlib2FyZEV2ZW50KToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICB2YXIgc2VyaWFsaXplZEV2ZW50ID0gc2VyaWFsaXplRXZlbnQoZSwgS0VZQk9BUkRfRVZFTlRfUFJPUEVSVElFUyk7XG4gIHJldHVybiBhZGRUYXJnZXQoZSwgc2VyaWFsaXplZEV2ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZVRyYW5zaXRpb25FdmVudChlOiBUcmFuc2l0aW9uRXZlbnQpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gIHZhciBzZXJpYWxpemVkRXZlbnQgPSBzZXJpYWxpemVFdmVudChlLCBUUkFOU0lUSU9OX0VWRU5UX1BST1BFUlRJRVMpO1xuICByZXR1cm4gYWRkVGFyZ2V0KGUsIHNlcmlhbGl6ZWRFdmVudCk7XG59XG5cbi8vIFRPRE8oanRlcGxpdHo2MDIpOiAjMzM3NC4gU2VlIGFib3ZlLlxuZnVuY3Rpb24gYWRkVGFyZ2V0KGU6IEV2ZW50LCBzZXJpYWxpemVkRXZlbnQ6IHtba2V5OiBzdHJpbmddOiBhbnl9KToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICBpZiAoTk9ERVNfV0lUSF9WQUxVRS5oYXMoKDxIVE1MRWxlbWVudD5lLnRhcmdldCkudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgIHZhciB0YXJnZXQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcbiAgICBzZXJpYWxpemVkRXZlbnRbJ3RhcmdldCddID0geyd2YWx1ZSc6IHRhcmdldC52YWx1ZX07XG4gICAgaWYgKGlzUHJlc2VudCh0YXJnZXQuZmlsZXMpKSB7XG4gICAgICBzZXJpYWxpemVkRXZlbnRbJ3RhcmdldCddWydmaWxlcyddID0gdGFyZ2V0LmZpbGVzO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2VyaWFsaXplZEV2ZW50O1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVFdmVudChlOiBhbnksIHByb3BlcnRpZXM6IHN0cmluZ1tdKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICB2YXIgc2VyaWFsaXplZCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcHJvcCA9IHByb3BlcnRpZXNbaV07XG4gICAgc2VyaWFsaXplZFtwcm9wXSA9IGVbcHJvcF07XG4gIH1cbiAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG59XG4iXX0=