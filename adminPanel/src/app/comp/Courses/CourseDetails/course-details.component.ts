import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { marked, Renderer, Tokens } from 'marked';
import hljs from 'highlight.js';
import { Course, Module, Lesson } from "../../../services/courses.service";
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

marked.use({
  renderer: {
    code(this: Renderer, token: Tokens.Code): string {
      const lang = token.lang ?? '';
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(token.text, { language }).value;
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    }
  }
});

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  course!: Course;
  editingLesson: string | null = null;
  activeTab: 'write' | 'preview' = 'write';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    marked.use({
      renderer: {
        code(this: Renderer, codeObj): string {
          const lang = codeObj.lang ?? '';
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          const highlighted = hljs.highlight(codeObj.text, { language }).value;
          return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
        }
      }
    });
  }

  renderMarkdown(markdown: string) {
    return marked.parse(markdown);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getCourseById(id).subscribe({
      next: (course) =>{ this.course = course;console.log(this.course)},
      error: () => {
        this.apiService.createCourse().subscribe((newCourse) => {
          this.course = newCourse.course;
          console.log(this.course);
        });
      }
    });
  }

updateCourse(field: keyof Course, event: Event): void {
  const target = event.target as HTMLElement;
  let value: string;

  if ('value' in target) {
    value = (target as HTMLInputElement | HTMLSelectElement).value;
  } else {
    value = target.innerText.trim();
  }

  (this.course as any)[field] = value;

  this.apiService.updateCourse(
    +this.course.id,
    this.course.title,
    this.course.description,
    this.course.level,
    this.course.duration
  ).subscribe({
    next: () => console.log('Course updated successfully'),
    error: (error) => console.error('Error updating course:', error)
  });
}

  updateModule(moduleIndex: number, field: keyof Module, event: Event): void {
    const element = event.target as HTMLElement;
    const module = this.course.modules[moduleIndex];
    module.title = element.innerText;
    this.apiService.updateModule(+module.id, module.title).subscribe({
      next: () => console.log('Module updated successfully'),
      error: (error) => console.error('Error updating module:', error)
    });
  }

  updateLesson(moduleIndex: number, lessonIndex: number, field: keyof Lesson, event: Event): void {
    const element = event.target as HTMLElement;
    const lesson = this.course.modules[moduleIndex].lessons[lessonIndex];
    (lesson as any)[field] = element.innerText;
    this.apiService.updateLesson(+lesson.id, lesson.title, lesson.content).subscribe({
      next: () => console.log('Lesson updated successfully'),
      error: (error) => console.error('Error updating lesson:', error)
    });
  }

  updateLessonContent(moduleIndex: number, lessonIndex: number, content: string): void {
    const lesson = this.course.modules[moduleIndex].lessons[lessonIndex];
    lesson.content = content;
    this.apiService.updateLesson(+lesson.id, lesson.title, lesson.content).subscribe({
      next: () => console.log('Lesson content updated successfully'),
      error: (error) => console.error('Error updating lesson content:', error)
    });
  }

  toggleEditor(moduleIndex: number, lessonIndex: number): void {
    const key = `${moduleIndex}-${lessonIndex}`;
    this.editingLesson = this.editingLesson === key ? null : key;
    this.activeTab = 'write';
  }

addModule(): void {
  this.apiService.createModule(+this.course.id).subscribe({
    next: (createdModule) => {
      if (!this.course.modules) {
        this.course.modules = [];
      }
      // Ensure lessons array exists on the new module
      createdModule.lessons = [];
      this.course.modules.push(createdModule);
      console.log('Module created successfully');
    },
    error: (error) => console.error('Error creating module:', error)
  });
}

  deleteModule(index: number): void {
    const moduleId = this.course.modules[index].id;
    this.course.modules.splice(index, 1);
    this.apiService.deleteModule(+moduleId).subscribe({
      next: () => console.log('Module deleted successfully'),
      error: (error) => console.error('Error deleting module:', error)
    });
  }

  addLesson(moduleIndex: number): void {
    const module = this.course.modules[moduleIndex];
    this.apiService.createLesson(+module.id).subscribe({
      next: (createdLesson) => {
        // Update new lesson with default content
        const updatedLesson = {
          ...createdLesson,
          title: 'New Lesson',
          content: '## Lesson Content\n\nStart writing here...'
        };
        this.apiService.updateLesson(updatedLesson.id, updatedLesson.title, updatedLesson.content).subscribe({
          next: () => {
            module.lessons.push(updatedLesson);
            console.log('Lesson created successfully');
          },
          error: (error) => console.error('Error initializing lesson:', error)
        });
      },
      error: (error) => console.error('Error creating lesson:', error)
    });
  }

  deleteLesson(moduleIndex: number, lessonIndex: number): void {
    const lessonId = this.course.modules[moduleIndex].lessons[lessonIndex].id;
    this.course.modules[moduleIndex].lessons.splice(lessonIndex, 1);
    this.apiService.deleteLesson(+lessonId).subscribe({
      next: () => console.log('Lesson deleted successfully'),
      error: (error) => console.error('Error deleting lesson:', error)
    });
  }
}