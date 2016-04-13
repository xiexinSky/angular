import { IS_DART, isPresent, isBlank } from 'angular2/src/facade/lang';
import { codify, combineGeneratedStrings, rawString } from './codegen_facade';
import { RecordType } from './proto_record';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * Class responsible for providing change detection logic for change detector classes.
 */
export class CodegenLogicUtil {
    constructor(_names, _utilName, _changeDetectorStateName) {
        this._names = _names;
        this._utilName = _utilName;
        this._changeDetectorStateName = _changeDetectorStateName;
    }
    /**
     * Generates a statement which updates the local variable representing `protoRec` with the current
     * value of the record. Used by property bindings.
     */
    genPropertyBindingEvalValue(protoRec) {
        return this._genEvalValue(protoRec, idx => this._names.getLocalName(idx), this._names.getLocalsAccessorName());
    }
    /**
     * Generates a statement which updates the local variable representing `protoRec` with the current
     * value of the record. Used by event bindings.
     */
    genEventBindingEvalValue(eventRecord, protoRec) {
        return this._genEvalValue(protoRec, idx => this._names.getEventLocalName(eventRecord, idx), "locals");
    }
    _genEvalValue(protoRec, getLocalName, localsAccessor) {
        var context = (protoRec.contextIndex == -1) ?
            this._names.getDirectiveName(protoRec.directiveIndex) :
            getLocalName(protoRec.contextIndex);
        var argString = protoRec.args.map(arg => getLocalName(arg)).join(", ");
        var rhs;
        switch (protoRec.mode) {
            case RecordType.Self:
                rhs = context;
                break;
            case RecordType.Const:
                rhs = codify(protoRec.funcOrValue);
                break;
            case RecordType.PropertyRead:
                rhs = `${context}.${protoRec.name}`;
                break;
            case RecordType.SafeProperty:
                var read = `${context}.${protoRec.name}`;
                rhs = `${this._utilName}.isValueBlank(${context}) ? null : ${read}`;
                break;
            case RecordType.PropertyWrite:
                rhs = `${context}.${protoRec.name} = ${getLocalName(protoRec.args[0])}`;
                break;
            case RecordType.Local:
                rhs = `${localsAccessor}.get(${rawString(protoRec.name)})`;
                break;
            case RecordType.InvokeMethod:
                rhs = `${context}.${protoRec.name}(${argString})`;
                break;
            case RecordType.SafeMethodInvoke:
                var invoke = `${context}.${protoRec.name}(${argString})`;
                rhs = `${this._utilName}.isValueBlank(${context}) ? null : ${invoke}`;
                break;
            case RecordType.InvokeClosure:
                rhs = `${context}(${argString})`;
                break;
            case RecordType.PrimitiveOp:
                rhs = `${this._utilName}.${protoRec.name}(${argString})`;
                break;
            case RecordType.CollectionLiteral:
                rhs = `${this._utilName}.${protoRec.name}(${argString})`;
                break;
            case RecordType.Interpolate:
                rhs = this._genInterpolation(protoRec);
                break;
            case RecordType.KeyedRead:
                rhs = `${context}[${getLocalName(protoRec.args[0])}]`;
                break;
            case RecordType.KeyedWrite:
                rhs = `${context}[${getLocalName(protoRec.args[0])}] = ${getLocalName(protoRec.args[1])}`;
                break;
            case RecordType.Chain:
                rhs = `${getLocalName(protoRec.args[protoRec.args.length - 1])}`;
                break;
            default:
                throw new BaseException(`Unknown operation ${protoRec.mode}`);
        }
        return `${getLocalName(protoRec.selfIndex)} = ${rhs};`;
    }
    genPropertyBindingTargets(propertyBindingTargets, genDebugInfo) {
        var bs = propertyBindingTargets.map(b => {
            if (isBlank(b))
                return "null";
            var debug = genDebugInfo ? codify(b.debug) : "null";
            return `${this._utilName}.bindingTarget(${codify(b.mode)}, ${b.elementIndex}, ${codify(b.name)}, ${codify(b.unit)}, ${debug})`;
        });
        return `[${bs.join(", ")}]`;
    }
    genDirectiveIndices(directiveRecords) {
        var bs = directiveRecords.map(b => `${this._utilName}.directiveIndex(${b.directiveIndex.elementIndex}, ${b.directiveIndex.directiveIndex})`);
        return `[${bs.join(", ")}]`;
    }
    /** @internal */
    _genInterpolation(protoRec) {
        var iVals = [];
        for (var i = 0; i < protoRec.args.length; ++i) {
            iVals.push(codify(protoRec.fixedArgs[i]));
            iVals.push(`${this._utilName}.s(${this._names.getLocalName(protoRec.args[i])})`);
        }
        iVals.push(codify(protoRec.fixedArgs[protoRec.args.length]));
        return combineGeneratedStrings(iVals);
    }
    genHydrateDirectives(directiveRecords) {
        var res = [];
        var outputCount = 0;
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            var dirVarName = this._names.getDirectiveName(r.directiveIndex);
            res.push(`${dirVarName} = ${this._genReadDirective(i)};`);
            if (isPresent(r.outputs)) {
                r.outputs.forEach(output => {
                    var eventHandlerExpr = this._genEventHandler(r.directiveIndex.elementIndex, output[1]);
                    var statementStart = `this.outputSubscriptions[${outputCount++}] = ${dirVarName}.${output[0]}`;
                    if (IS_DART) {
                        res.push(`${statementStart}.listen(${eventHandlerExpr});`);
                    }
                    else {
                        res.push(`${statementStart}.subscribe({next: ${eventHandlerExpr}});`);
                    }
                });
            }
        }
        if (outputCount > 0) {
            var statementStart = 'this.outputSubscriptions';
            if (IS_DART) {
                res.unshift(`${statementStart} = new List(${outputCount});`);
            }
            else {
                res.unshift(`${statementStart} = new Array(${outputCount});`);
            }
        }
        return res.join("\n");
    }
    genDirectivesOnDestroy(directiveRecords) {
        var res = [];
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            if (r.callOnDestroy) {
                var dirVarName = this._names.getDirectiveName(r.directiveIndex);
                res.push(`${dirVarName}.ngOnDestroy();`);
            }
        }
        return res.join("\n");
    }
    _genEventHandler(boundElementIndex, eventName) {
        if (IS_DART) {
            return `(event) => this.handleEvent('${eventName}', ${boundElementIndex}, event)`;
        }
        else {
            return `(function(event) { return this.handleEvent('${eventName}', ${boundElementIndex}, event); }).bind(this)`;
        }
    }
    _genReadDirective(index) { return `this.getDirectiveFor(directives, ${index})`; }
    genHydrateDetectors(directiveRecords) {
        var res = [];
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            if (!r.isDefaultChangeDetection()) {
                res.push(`${this._names.getDetectorName(r.directiveIndex)} = this.getDetectorFor(directives, ${i});`);
            }
        }
        return res.join("\n");
    }
    genContentLifecycleCallbacks(directiveRecords) {
        var res = [];
        var eq = IS_DART ? '==' : '===';
        // NOTE(kegluneq): Order is important!
        for (var i = directiveRecords.length - 1; i >= 0; --i) {
            var dir = directiveRecords[i];
            if (dir.callAfterContentInit) {
                res.push(`if(${this._names.getStateName()} ${eq} ${this._changeDetectorStateName}.NeverChecked) ${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterContentInit();`);
            }
            if (dir.callAfterContentChecked) {
                res.push(`${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterContentChecked();`);
            }
        }
        return res;
    }
    genViewLifecycleCallbacks(directiveRecords) {
        var res = [];
        var eq = IS_DART ? '==' : '===';
        // NOTE(kegluneq): Order is important!
        for (var i = directiveRecords.length - 1; i >= 0; --i) {
            var dir = directiveRecords[i];
            if (dir.callAfterViewInit) {
                res.push(`if(${this._names.getStateName()} ${eq} ${this._changeDetectorStateName}.NeverChecked) ${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterViewInit();`);
            }
            if (dir.callAfterViewChecked) {
                res.push(`${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterViewChecked();`);
            }
        }
        return res;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbl9sb2dpY191dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1XMm00Q2l4MS50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jb2RlZ2VuX2xvZ2ljX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxPQUFPLEVBQXVCLFNBQVMsRUFBRSxPQUFPLEVBQUMsTUFBTSwwQkFBMEI7T0FFbEYsRUFBQyxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFDLE1BQU0sa0JBQWtCO09BQ3BFLEVBQWMsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCO09BRy9DLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO0FBRTVEOztHQUVHO0FBQ0g7SUFDRSxZQUFvQixNQUF1QixFQUFVLFNBQWlCLEVBQ2xELHdCQUFnQztRQURoQyxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDbEQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUFRO0lBQUcsQ0FBQztJQUV4RDs7O09BR0c7SUFDSCwyQkFBMkIsQ0FBQyxRQUFxQjtRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsd0JBQXdCLENBQUMsV0FBZ0IsRUFBRSxRQUFxQjtRQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUNoRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxD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LENBQUM7WUFDdEQsSUFBSSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDMUIsR0FBRyxDQUFDLElBQUksQ0FDSixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyx3QkFBd0Isa0JBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3RLLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDeEYsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVNfREFSVCwgSnNvbiwgU3RyaW5nV3JhcHBlciwgaXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtDb2RlZ2VuTmFtZVV0aWx9IGZyb20gJy4vY29kZWdlbl9uYW1lX3V0aWwnO1xuaW1wb3J0IHtjb2RpZnksIGNvbWJpbmVHZW5lcmF0ZWRTdHJpbmdzLCByYXdTdHJpbmd9IGZyb20gJy4vY29kZWdlbl9mYWNhZGUnO1xuaW1wb3J0IHtQcm90b1JlY29yZCwgUmVjb3JkVHlwZX0gZnJvbSAnLi9wcm90b19yZWNvcmQnO1xuaW1wb3J0IHtCaW5kaW5nVGFyZ2V0fSBmcm9tICcuL2JpbmRpbmdfcmVjb3JkJztcbmltcG9ydCB7RGlyZWN0aXZlUmVjb3JkfSBmcm9tICcuL2RpcmVjdGl2ZV9yZWNvcmQnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG4vKipcbiAqIENsYXNzIHJlc3BvbnNpYmxlIGZvciBwcm92aWRpbmcgY2hhbmdlIGRldGVjdGlvbiBsb2dpYyBmb3IgY2hhbmdlIGRldGVjdG9yIGNsYXNzZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2RlZ2VuTG9naWNVdGlsIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbmFtZXM6IENvZGVnZW5OYW1lVXRpbCwgcHJpdmF0ZSBfdXRpbE5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JTdGF0ZU5hbWU6IHN0cmluZykge31cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgc3RhdGVtZW50IHdoaWNoIHVwZGF0ZXMgdGhlIGxvY2FsIHZhcmlhYmxlIHJlcHJlc2VudGluZyBgcHJvdG9SZWNgIHdpdGggdGhlIGN1cnJlbnRcbiAgICogdmFsdWUgb2YgdGhlIHJlY29yZC4gVXNlZCBieSBwcm9wZXJ0eSBiaW5kaW5ncy5cbiAgICovXG4gIGdlblByb3BlcnR5QmluZGluZ0V2YWxWYWx1ZShwcm90b1JlYzogUHJvdG9SZWNvcmQpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9nZW5FdmFsVmFsdWUocHJvdG9SZWMsIGlkeCA9PiB0aGlzLl9uYW1lcy5nZXRMb2NhbE5hbWUoaWR4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVzLmdldExvY2Fsc0FjY2Vzc29yTmFtZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBzdGF0ZW1lbnQgd2hpY2ggdXBkYXRlcyB0aGUgbG9jYWwgdmFyaWFibGUgcmVwcmVzZW50aW5nIGBwcm90b1JlY2Agd2l0aCB0aGUgY3VycmVudFxuICAgKiB2YWx1ZSBvZiB0aGUgcmVjb3JkLiBVc2VkIGJ5IGV2ZW50IGJpbmRpbmdzLlxuICAgKi9cbiAgZ2VuRXZlbnRCaW5kaW5nRXZhbFZhbHVlKGV2ZW50UmVjb3JkOiBhbnksIHByb3RvUmVjOiBQcm90b1JlY29yZCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbkV2YWxWYWx1ZShwcm90b1JlYywgaWR4ID0+IHRoaXMuX25hbWVzLmdldEV2ZW50TG9jYWxOYW1lKGV2ZW50UmVjb3JkLCBpZHgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2NhbHNcIik7XG4gIH1cblxuICBwcml2YXRlIF9nZW5FdmFsVmFsdWUocHJvdG9SZWM6IFByb3RvUmVjb3JkLCBnZXRMb2NhbE5hbWU6IEZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxzQWNjZXNzb3I6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFyIGNvbnRleHQgPSAocHJvdG9SZWMuY29udGV4dEluZGV4ID09IC0xKSA/XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShwcm90b1JlYy5kaXJlY3RpdmVJbmRleCkgOlxuICAgICAgICAgICAgICAgICAgICAgIGdldExvY2FsTmFtZShwcm90b1JlYy5jb250ZXh0SW5kZXgpO1xuICAgIHZhciBhcmdTdHJpbmcgPSBwcm90b1JlYy5hcmdzLm1hcChhcmcgPT4gZ2V0TG9jYWxOYW1lKGFyZykpLmpvaW4oXCIsIFwiKTtcblxuICAgIHZhciByaHM6IHN0cmluZztcbiAgICBzd2l0Y2ggKHByb3RvUmVjLm1vZGUpIHtcbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5TZWxmOlxuICAgICAgICByaHMgPSBjb250ZXh0O1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkNvbnN0OlxuICAgICAgICByaHMgPSBjb2RpZnkocHJvdG9SZWMuZnVuY09yVmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlByb3BlcnR5UmVhZDpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH0uJHtwcm90b1JlYy5uYW1lfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuU2FmZVByb3BlcnR5OlxuICAgICAgICB2YXIgcmVhZCA9IGAke2NvbnRleHR9LiR7cHJvdG9SZWMubmFtZX1gO1xuICAgICAgICByaHMgPSBgJHt0aGlzLl91dGlsTmFtZX0uaXNWYWx1ZUJsYW5rKCR7Y29udGV4dH0pID8gbnVsbCA6ICR7cmVhZH1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlByb3BlcnR5V3JpdGU6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9LiR7cHJvdG9SZWMubmFtZX0gPSAke2dldExvY2FsTmFtZShwcm90b1JlYy5hcmdzWzBdKX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkxvY2FsOlxuICAgICAgICByaHMgPSBgJHtsb2NhbHNBY2Nlc3Nvcn0uZ2V0KCR7cmF3U3RyaW5nKHByb3RvUmVjLm5hbWUpfSlgO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkludm9rZU1ldGhvZDpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH0uJHtwcm90b1JlYy5uYW1lfSgke2FyZ1N0cmluZ30pYDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5TYWZlTWV0aG9kSW52b2tlOlxuICAgICAgICB2YXIgaW52b2tlID0gYCR7Y29udGV4dH0uJHtwcm90b1JlYy5uYW1lfSgke2FyZ1N0cmluZ30pYDtcbiAgICAgICAgcmhzID0gYCR7dGhpcy5fdXRpbE5hbWV9LmlzVmFsdWVCbGFuaygke2NvbnRleHR9KSA/IG51bGwgOiAke2ludm9rZX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkludm9rZUNsb3N1cmU6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9KCR7YXJnU3RyaW5nfSlgO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlByaW1pdGl2ZU9wOlxuICAgICAgICByaHMgPSBgJHt0aGlzLl91dGlsTmFtZX0uJHtwcm90b1JlYy5uYW1lfSgke2FyZ1N0cmluZ30pYDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Db2xsZWN0aW9uTGl0ZXJhbDpcbiAgICAgICAgcmhzID0gYCR7dGhpcy5fdXRpbE5hbWV9LiR7cHJvdG9SZWMubmFtZX0oJHthcmdTdHJpbmd9KWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuSW50ZXJwb2xhdGU6XG4gICAgICAgIHJocyA9IHRoaXMuX2dlbkludGVycG9sYXRpb24ocHJvdG9SZWMpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLktleWVkUmVhZDpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH1bJHtnZXRMb2NhbE5hbWUocHJvdG9SZWMuYXJnc1swXSl9XWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuS2V5ZWRXcml0ZTpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH1bJHtnZXRMb2NhbE5hbWUocHJvdG9SZWMuYXJnc1swXSl9XSA9ICR7Z2V0TG9jYWxOYW1lKHByb3RvUmVjLmFyZ3NbMV0pfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuQ2hhaW46XG4gICAgICAgIHJocyA9IGAke2dldExvY2FsTmFtZShwcm90b1JlYy5hcmdzW3Byb3RvUmVjLmFyZ3MubGVuZ3RoIC0gMV0pfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgVW5rbm93biBvcGVyYXRpb24gJHtwcm90b1JlYy5tb2RlfWApO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Z2V0TG9jYWxOYW1lKHByb3RvUmVjLnNlbGZJbmRleCl9ID0gJHtyaHN9O2A7XG4gIH1cblxuICBnZW5Qcm9wZXJ0eUJpbmRpbmdUYXJnZXRzKHByb3BlcnR5QmluZGluZ1RhcmdldHM6IEJpbmRpbmdUYXJnZXRbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5EZWJ1Z0luZm86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHZhciBicyA9IHByb3BlcnR5QmluZGluZ1RhcmdldHMubWFwKGIgPT4ge1xuICAgICAgaWYgKGlzQmxhbmsoYikpIHJldHVybiBcIm51bGxcIjtcblxuICAgICAgdmFyIGRlYnVnID0gZ2VuRGVidWdJbmZvID8gY29kaWZ5KGIuZGVidWcpIDogXCJudWxsXCI7XG4gICAgICByZXR1cm4gYCR7dGhpcy5fdXRpbE5hbWV9LmJpbmRpbmdUYXJnZXQoJHtjb2RpZnkoYi5tb2RlKX0sICR7Yi5lbGVtZW50SW5kZXh9LCAke2NvZGlmeShiLm5hbWUpfSwgJHtjb2RpZnkoYi51bml0KX0sICR7ZGVidWd9KWA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGBbJHticy5qb2luKFwiLCBcIil9XWA7XG4gIH1cblxuICBnZW5EaXJlY3RpdmVJbmRpY2VzKGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdKTogc3RyaW5nIHtcbiAgICB2YXIgYnMgPSBkaXJlY3RpdmVSZWNvcmRzLm1hcChcbiAgICAgICAgYiA9PlxuICAgICAgICAgICAgYCR7dGhpcy5fdXRpbE5hbWV9LmRpcmVjdGl2ZUluZGV4KCR7Yi5kaXJlY3RpdmVJbmRleC5lbGVtZW50SW5kZXh9LCAke2IuZGlyZWN0aXZlSW5kZXguZGlyZWN0aXZlSW5kZXh9KWApO1xuICAgIHJldHVybiBgWyR7YnMuam9pbihcIiwgXCIpfV1gO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2VuSW50ZXJwb2xhdGlvbihwcm90b1JlYzogUHJvdG9SZWNvcmQpOiBzdHJpbmcge1xuICAgIHZhciBpVmFscyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvdG9SZWMuYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgaVZhbHMucHVzaChjb2RpZnkocHJvdG9SZWMuZml4ZWRBcmdzW2ldKSk7XG4gICAgICBpVmFscy5wdXNoKGAke3RoaXMuX3V0aWxOYW1lfS5zKCR7dGhpcy5fbmFtZXMuZ2V0TG9jYWxOYW1lKHByb3RvUmVjLmFyZ3NbaV0pfSlgKTtcbiAgICB9XG4gICAgaVZhbHMucHVzaChjb2RpZnkocHJvdG9SZWMuZml4ZWRBcmdzW3Byb3RvUmVjLmFyZ3MubGVuZ3RoXSkpO1xuICAgIHJldHVybiBjb21iaW5lR2VuZXJhdGVkU3RyaW5ncyhpVmFscyk7XG4gIH1cblxuICBnZW5IeWRyYXRlRGlyZWN0aXZlcyhkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSk6IHN0cmluZyB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHZhciBvdXRwdXRDb3VudCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgciA9IGRpcmVjdGl2ZVJlY29yZHNbaV07XG4gICAgICB2YXIgZGlyVmFyTmFtZSA9IHRoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUoci5kaXJlY3RpdmVJbmRleCk7XG4gICAgICByZXMucHVzaChgJHtkaXJWYXJOYW1lfSA9ICR7dGhpcy5fZ2VuUmVhZERpcmVjdGl2ZShpKX07YCk7XG4gICAgICBpZiAoaXNQcmVzZW50KHIub3V0cHV0cykpIHtcbiAgICAgICAgci5vdXRwdXRzLmZvckVhY2gob3V0cHV0ID0+IHtcbiAgICAgICAgICB2YXIgZXZlbnRIYW5kbGVyRXhwciA9IHRoaXMuX2dlbkV2ZW50SGFuZGxlcihyLmRpcmVjdGl2ZUluZGV4LmVsZW1lbnRJbmRleCwgb3V0cHV0WzFdKTtcbiAgICAgICAgICB2YXIgc3RhdGVtZW50U3RhcnQgPVxuICAgICAgICAgICAgICBgdGhpcy5vdXRwdXRTdWJzY3JpcHRpb25zWyR7b3V0cHV0Q291bnQrK31dID0gJHtkaXJWYXJOYW1lfS4ke291dHB1dFswXX1gO1xuICAgICAgICAgIGlmIChJU19EQVJUKSB7XG4gICAgICAgICAgICByZXMucHVzaChgJHtzdGF0ZW1lbnRTdGFydH0ubGlzdGVuKCR7ZXZlbnRIYW5kbGVyRXhwcn0pO2ApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMucHVzaChgJHtzdGF0ZW1lbnRTdGFydH0uc3Vic2NyaWJlKHtuZXh0OiAke2V2ZW50SGFuZGxlckV4cHJ9fSk7YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG91dHB1dENvdW50ID4gMCkge1xuICAgICAgdmFyIHN0YXRlbWVudFN0YXJ0ID0gJ3RoaXMub3V0cHV0U3Vic2NyaXB0aW9ucyc7XG4gICAgICBpZiAoSVNfREFSVCkge1xuICAgICAgICByZXMudW5zaGlmdChgJHtzdGF0ZW1lbnRTdGFydH0gPSBuZXcgTGlzdCgke291dHB1dENvdW50fSk7YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMudW5zaGlmdChgJHtzdGF0ZW1lbnRTdGFydH0gPSBuZXcgQXJyYXkoJHtvdXRwdXRDb3VudH0pO2ApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBnZW5EaXJlY3RpdmVzT25EZXN0cm95KGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdKTogc3RyaW5nIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgciA9IGRpcmVjdGl2ZVJlY29yZHNbaV07XG4gICAgICBpZiAoci5jYWxsT25EZXN0cm95KSB7XG4gICAgICAgIHZhciBkaXJWYXJOYW1lID0gdGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShyLmRpcmVjdGl2ZUluZGV4KTtcbiAgICAgICAgcmVzLnB1c2goYCR7ZGlyVmFyTmFtZX0ubmdPbkRlc3Ryb3koKTtgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcy5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuRXZlbnRIYW5kbGVyKGJvdW5kRWxlbWVudEluZGV4OiBudW1iZXIsIGV2ZW50TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoSVNfREFSVCkge1xuICAgICAgcmV0dXJuIGAoZXZlbnQpID0+IHRoaXMuaGFuZGxlRXZlbnQoJyR7ZXZlbnROYW1lfScsICR7Ym91bmRFbGVtZW50SW5kZXh9LCBldmVudClgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYChmdW5jdGlvbihldmVudCkgeyByZXR1cm4gdGhpcy5oYW5kbGVFdmVudCgnJHtldmVudE5hbWV9JywgJHtib3VuZEVsZW1lbnRJbmRleH0sIGV2ZW50KTsgfSkuYmluZCh0aGlzKWA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuUmVhZERpcmVjdGl2ZShpbmRleDogbnVtYmVyKSB7IHJldHVybiBgdGhpcy5nZXREaXJlY3RpdmVGb3IoZGlyZWN0aXZlcywgJHtpbmRleH0pYDsgfVxuXG4gIGdlbkh5ZHJhdGVEZXRlY3RvcnMoZGlyZWN0aXZlUmVjb3JkczogRGlyZWN0aXZlUmVjb3JkW10pOiBzdHJpbmcge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpcmVjdGl2ZVJlY29yZHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciByID0gZGlyZWN0aXZlUmVjb3Jkc1tpXTtcbiAgICAgIGlmICghci5pc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb24oKSkge1xuICAgICAgICByZXMucHVzaChcbiAgICAgICAgICAgIGAke3RoaXMuX25hbWVzLmdldERldGVjdG9yTmFtZShyLmRpcmVjdGl2ZUluZGV4KX0gPSB0aGlzLmdldERldGVjdG9yRm9yKGRpcmVjdGl2ZXMsICR7aX0pO2ApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBnZW5Db250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzKGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdKTogc3RyaW5nW10ge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICB2YXIgZXEgPSBJU19EQVJUID8gJz09JyA6ICc9PT0nO1xuICAgIC8vIE5PVEUoa2VnbHVuZXEpOiBPcmRlciBpcyBpbXBvcnRhbnQhXG4gICAgZm9yICh2YXIgaSA9IGRpcmVjdGl2ZVJlY29yZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHZhciBkaXIgPSBkaXJlY3RpdmVSZWNvcmRzW2ldO1xuICAgICAgaWYgKGRpci5jYWxsQWZ0ZXJDb250ZW50SW5pdCkge1xuICAgICAgICByZXMucHVzaChcbiAgICAgICAgICAgIGBpZigke3RoaXMuX25hbWVzLmdldFN0YXRlTmFtZSgpfSAke2VxfSAke3RoaXMuX2NoYW5nZURldGVjdG9yU3RhdGVOYW1lfS5OZXZlckNoZWNrZWQpICR7dGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShkaXIuZGlyZWN0aXZlSW5kZXgpfS5uZ0FmdGVyQ29udGVudEluaXQoKTtgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpci5jYWxsQWZ0ZXJDb250ZW50Q2hlY2tlZCkge1xuICAgICAgICByZXMucHVzaChgJHt0aGlzLl9uYW1lcy5nZXREaXJlY3RpdmVOYW1lKGRpci5kaXJlY3RpdmVJbmRleCl9Lm5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpO2ApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2VuVmlld0xpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSk6IHN0cmluZ1tdIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgdmFyIGVxID0gSVNfREFSVCA/ICc9PScgOiAnPT09JztcbiAgICAvLyBOT1RFKGtlZ2x1bmVxKTogT3JkZXIgaXMgaW1wb3J0YW50IVxuICAgIGZvciAodmFyIGkgPSBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB2YXIgZGlyID0gZGlyZWN0aXZlUmVjb3Jkc1tpXTtcbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyVmlld0luaXQpIHtcbiAgICAgICAgcmVzLnB1c2goXG4gICAgICAgICAgICBgaWYoJHt0aGlzLl9uYW1lcy5nZXRTdGF0ZU5hbWUoKX0gJHtlcX0gJHt0aGlzLl9jaGFuZ2VEZXRlY3RvclN0YXRlTmFtZX0uTmV2ZXJDaGVja2VkKSAke3RoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUoZGlyLmRpcmVjdGl2ZUluZGV4KX0ubmdBZnRlclZpZXdJbml0KCk7YCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyVmlld0NoZWNrZWQpIHtcbiAgICAgICAgcmVzLnB1c2goYCR7dGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShkaXIuZGlyZWN0aXZlSW5kZXgpfS5uZ0FmdGVyVmlld0NoZWNrZWQoKTtgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuIl19