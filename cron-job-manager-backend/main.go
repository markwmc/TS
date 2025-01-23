package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/robfig/cron/v3"
	"net/http"
	"strconv"
	"sync"
)

var cronJobs = make(map[int]CronJob)
var cronIDCounter =1
var cronMutex sync.Mutex

type CronJob struct {
	ID 			   int 	`json:"id"`
	TaskName	   string	`json:"task_name"`
	CronExpression string `json:"cron_expression"`
}

func createCronJob(c echo.Context) error {
	var newCronJob CronJob
	if err := c.Bind(&newCronJob); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error":"Invalid data"})
	}

	cronMutex.Lock()
	defer cronMutex.Unlock()

	newCronJob.ID = cronIDCounter
	cronIDCounter++

	cro := cron.New()
	_, err := cro.AddFunc(newCronJob.CronExpression, func() {
		fmt.Println("Executing task:", newCronJob.TaskName)
	})
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid cron expression"})
	}
	cro.Start()

	cronJobs[newCronJob.ID] = newCronJob
	return c.JSON(http.StatusOK, newCronJob)
}

func getCronJobs(c echo.Context) error {
	cronMutex.Lock()
	defer cronMutex.Unlock()

	var jobList []CronJob
	for _, job := range cronJobs {
		jobList = append(jobList, job)
	}

	return c.JSON(http.StatusOK, jobList)
}

func editCronJob(c echo.Context) error {
	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid job ID"})
	}

	var updatedJob CronJob
	if err := c.Bind(&updatedJob); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error":"Invalid data"})
	}

	cronMutex.Lock()
	defer cronMutex.Unlock()

	existingJob, exists := cronJobs[jobID]
	if !exists {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Cron job not found"})
	}

	existingJob.TaskName = updatedJob.TaskName
	existingJob.CronExpression = updatedJob.CronExpression
	cronJobs[jobID] = existingJob

	c.JSON(http.StatusOK,  existingJob)
	return nil
}

func deleteCronJob(c echo.Context) error {
	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid job ID"})
	}

	cronMutex.Lock()
	defer cronMutex.Unlock()

	_, exists := cronJobs[jobID]
	if !exists {
		return c.JSON(http.StatusNotFound, map[string]string{"error":"Cron job not found"})
	}

	delete(cronJobs, jobID)

	return c.JSON(http.StatusOK, map[string]string{"message":"Cron job deletes"})
}

func main() {
	e := echo.New()

	e.POST("/api/create-cron", createCronJob)
	e.GET("api/cron-jobs", getCronJobs)
	e.PUT("/api/edit-cron/:id", editCronJob)
	e.DELETE("/api/delete-cron/:id", deleteCronJob)

	e.Logger.Fatal(e.Start(":8080"))
}