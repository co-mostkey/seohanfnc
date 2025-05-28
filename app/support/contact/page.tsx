"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })

  // 회원일 경우 로컬 스토리지에 저장된 사용자 정보를 자동으로 불러옵니다.
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedPhone = localStorage.getItem('userPhone');
    if (storedEmail) {
      setFormData(prev => ({
        ...prev,
        name: storedName || prev.name,
        email: storedEmail,
        phone: storedPhone || prev.phone,
      }));
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 사용자 정보 로컬스토리지에 저장
    if (name === 'name') {
      localStorage.setItem('userName', value);
    } else if (name === 'email') {
      localStorage.setItem('userEmail', value);
    } else if (name === 'phone') {
      localStorage.setItem('userPhone', value);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // API로 문의 데이터 전송
      const response = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.subject,
          content: formData.message,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          company: formData.company,
          type: 'general',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '문의 제출 중 오류가 발생했습니다.');
      }

      setSubmitResult({
        success: true,
        message: "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.",
      });
    } catch (error) {
      console.error("문의 제출 중 오류 발생:", error);
      setSubmitResult({
        success: false,
        message: "문의 제출 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">문의하기</h1>
            <p className="text-lg text-blue-100 md:text-xl">
              서한에프앤씨에 궁금한 점이 있으시면 언제든지 문의해 주세요. 빠른 시일 내에 답변 드리겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <h2 className="mb-6 text-2xl font-bold">연락처 정보</h2>

              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <MapPin className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                    <div>
                      <h3 className="mb-2 font-semibold">주소</h3>
                      <p className="text-gray-600">경상북도 경주시 외동읍 영지로 63</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <Phone className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                    <div>
                      <h3 className="mb-2 font-semibold">전화</h3>
                      <p className="text-gray-600">054-748-5133</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <Mail className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                    <div>
                      <h3 className="mb-2 font-semibold">이메일</h3>
                      <p className="text-gray-600">info@shfnc.com</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="mb-3 font-semibold">업무 시간</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>월요일 - 금요일:</span>
                      <span>09:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>토요일:</span>
                      <span>09:00 - 13:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>일요일:</span>
                      <span>휴무</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-6 text-2xl font-bold">문의 양식</h2>

                  {submitResult ? (
                    <div
                      className={`mb-6 rounded-lg p-4 ${submitResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                    >
                      {submitResult.message}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">이름 *</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">이메일 *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">전화번호 *</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">회사명</Label>
                          <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">제목 *</Label>
                        <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">문의 내용 *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mt-6">
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? "제출 중..." : "문의하기"}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">오시는 길</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">서한에프앤씨 본사 위치를 안내해 드립니다.</p>
          </div>

          <div className="overflow-hidden rounded-lg shadow-md">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3248.674393278368!2d129.3!3d35.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQyJzAwLjAiTiAxMjnCsDE4JzAwLjAiRQ!5e0!3m2!1sen!2skr!4v1650000000000!5m2!1sen!2skr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="서한에프앤씨 위치"
              ></iframe>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">자가용 이용 시</h3>
              <p className="text-gray-600">경부고속도로 경주 IC에서 외동 방면으로 약 15분 소요</p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">대중교통 이용 시</h3>
              <p className="text-gray-600">경주역에서 700번 버스 이용, 외동읍사무소 하차 후 도보 10분</p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">주차 안내</h3>
              <p className="text-gray-600">본사 내 무료 주차장 이용 가능 (50대 수용)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

