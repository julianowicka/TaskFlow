import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renderuje treść i emituje buttonClick', () => {
    // Arrange
    spyOn(component.buttonClick, 'emit');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    // Act
    button.click();

    // Assert
    expect(component.buttonClick.emit).toHaveBeenCalled();
  });

  it('ustawia disabled i blokuje klik', () => {
    // Arrange
    component.disabled = true;
    fixture.detectChanges();
    spyOn(component.buttonClick, 'emit');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    // Act
    button.click();

    // Assert
    expect(button.disabled).toBeTrue();
    expect(component.buttonClick.emit).not.toHaveBeenCalled();
  });

  it('obsługuje aria-label, gdy brak tekstu', () => {
    // Arrange
    const testAriaLabel = 'Usuń';
    component.ariaLabel = testAriaLabel;
    fixture.detectChanges();

    // Assert
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.getAttribute('aria-label')).toBe(testAriaLabel);
  });
});
