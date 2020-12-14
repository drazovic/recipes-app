import { Directive, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appDropdown]',
})
export class DropdownDirective {
    isShown = false;
    @Input('appDropdown') dropdownTarget: HTMLDivElement | HTMLUListElement;

    constructor(private renderer: Renderer2) {}

    @HostListener('click') toggleOpen() {
        this.toggleIsShown();
        this.toggleShowClass();
    }

    toggleIsShown() {
        this.isShown = !this.isShown;
    }

    toggleShowClass() {
        if (this.isShown) {
            this.renderer.addClass(this.dropdownTarget, 'show');
        } else {
            this.renderer.removeClass(this.dropdownTarget, 'show');
        }
    }
}
