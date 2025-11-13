"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

interface Course {
  subjectName: string;
  grade: string;
  credits: string;
}

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { subjectName: "Mathematics", grade: "A", credits: "3" },
    { subjectName: "English", grade: "B", credits: "4" },
    { subjectName: "Science", grade: "A", credits: "3" },
  ]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number; distribution: {[key: string]: number} } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["gpa", ...recent.filter((id: string) => id !== "gpa")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const gradePoints: { [key: string]: number } = {
    "A+": 4.0, A: 4.0, "A-": 3.7,
    "B+": 3.3, B: 3.0, "B-": 2.7,
    "C+": 2.3, C: 2.0, "C-": 1.7,
    "D+": 1.3, D: 1.0, F: 0.0,
  };

  const addCourse = () => {
    setCourses([...courses, { subjectName: `Subject ${courses.length + 1}`, grade: "A", credits: "3" }]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const calculate = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    const distribution: {[key: string]: number} = {};

    courses.forEach((course) => {
      const credits = parseFloat(course.credits);
      const points = gradePoints[course.grade] || 0;
      if (!isNaN(credits)) {
        totalPoints += points * credits;
        totalCredits += credits;
        distribution[course.grade] = (distribution[course.grade] || 0) + 1;
      }
    });

    if (totalCredits > 0) {
      setResult({ gpa: totalPoints / totalCredits, totalCredits, distribution });
    }
  };

  useEffect(() => {
    calculate();
  }, [courses]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "GPA Calculator", href: "/calculators/math/gpa-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GPA Calculator</h1>
        <p className="text-base text-gray-600">
          Calculate your Grade Point Average with subject names, grades, and credits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Input Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Courses</h2>
            
            <div className="space-y-3 mb-4">
              {courses.map((course, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-12 mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Subject Name</label>
                      <input
                        type="text"
                        value={course.subjectName}
                        onChange={(e) => updateCourse(index, "subjectName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter subject name"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Grade</label>
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(index, "grade", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {Object.keys(gradePoints).map((grade) => (
                          <option key={grade} value={grade}>{grade} ({gradePoints[grade].toFixed(1)})</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Credits</label>
                      <input
                        type="number"
                        value={course.credits}
                        onChange={(e) => updateCourse(index, "credits", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="3"
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <button
                        onClick={() => removeCourse(index)}
                        className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-xs font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addCourse}
              className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50 font-medium transition-colors"
            >
              + Add Course
            </button>
          </div>
        </div>

        {/* Right Side - Results and Visualization */}
        <div className="space-y-4">
          {result && (
            <>
              {/* GPA Display */}
              <div className="bg-purple-600 rounded-xl shadow-lg p-6 sm:p-8 text-white text-center">
                <h3 className="text-lg font-semibold mb-2 opacity-90">Your GPA</h3>
                <div className="text-6xl font-bold mb-3">
                  {result.gpa.toFixed(2)}
                </div>
                <div className="text-sm opacity-90">
                  Based on {result.totalCredits} total credits
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-sm font-medium">
                    {result.gpa >= 3.8 ? "🌟 Excellent!" : result.gpa >= 3.5 ? "👏 Very Good!" : result.gpa >= 3.0 ? "✅ Good!" : result.gpa >= 2.0 ? "📚 Fair" : "💪 Keep Working!"}
                  </div>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(result.distribution).sort().map(([grade, count]) => (
                    <div key={grade} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-bold text-gray-900">{grade}</div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div 
                            className="bg-purple-600 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all"
                            style={{ width: `${(count / courses.length) * 100}%` }}
                          >
                            {count > 0 && `${count}`}
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-600 text-right">
                        {((count / courses.length) * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Subject Breakdown</h3>
                <div className="space-y-2">
                  {courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">{course.subjectName}</div>
                        <div className="text-xs text-gray-600">{course.credits} credits</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        gradePoints[course.grade] >= 3.7 ? "bg-green-100 text-green-700" :
                        gradePoints[course.grade] >= 3.0 ? "bg-blue-100 text-blue-700" :
                        gradePoints[course.grade] >= 2.0 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {course.grade}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How GPA is Calculated</h2>
            <p className="mb-4">
              GPA (Grade Point Average) is calculated by dividing the total grade points earned by the total credit hours attempted.
            </p>
            <p className="mb-4"><strong>Formula:</strong> GPA = (Sum of Grade Points × Credits) / Total Credits</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Grade Point Scale</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>A/A+ = 4.0</div>
                <div>B = 3.0</div>
                <div>A- = 3.7</div>
                <div>B- = 2.7</div>
                <div>B+ = 3.3</div>
                <div>C+ = 2.3</div>
                <div>C = 2.0</div>
                <div>D = 1.0</div>
              </div>
            </div>
          </div>
        }
        faqs={[
          { question: "What is a good GPA?", answer: "Generally, a GPA of 3.0 or above (B average) is considered good. A 3.5+ is very good, and 3.8+ is excellent." },
          { question: "How do I improve my GPA?", answer: "Focus on earning higher grades in courses with more credits, as they have a greater impact on your overall GPA." },
        ]}
        relatedCalculators={[
          { name: "Grade Calculator", href: "/calculators/math/grade-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
